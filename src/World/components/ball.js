import * as THREE from '../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';
function createBall() {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.path = 'putt';
    const createMaterial = () => {
        textureLoader.load(
            '../../assets/uv.jpg',
            (texture) => { 
                ball.mesh.material = new THREE.MeshStandardMaterial({
                    map: texture,
                });
            },
        );
    }

    const radius = 0.042; //meters
    const widthSegments = 32;
    const heightSegments = 16;
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const material = new THREE.MeshStandardMaterial();
    const physMaterial = new CANNON.Material('ball');

    const ball = {
        mesh: new THREE.Mesh(geometry, material),
        body: new CANNON.Body({
            mass: 0.045, //kg
            shape: new CANNON.Sphere(radius),
            material: physMaterial,
            angularDamping: 0.70,
        }),
    };

    createMaterial();

    //ball.body.position.set(0, 0.1, 0);
    ball.body.position.set(0, 2, 0);
    ball.body.quaternion.setFromEuler(-0.5, -0.1, 0.8);

    ball.mesh.position.copy(ball.body.position);
    ball.mesh.quaternion.copy(ball.body.quaternion);

    ball.body.material = new CANNON.Material({
        friction: 0.8,
        restitution: 0.9,
    });

    ball.touchSphere = createBallTouchSphere();

    ball.tick = (delta) => {
        ball.mesh.position.copy(ball.body.position);
        ball.mesh.quaternion.copy(ball.body.quaternion);
        ball.touchSphere.mesh.position.copy(ball.mesh.position);

        if (ball.mesh.position.y < -10) {
            ball.mesh.position.set(0, 2, 0);
            ball.body.position.copy(ball.mesh.position);
            ball.body.velocity.set(0, 0, 0);
            ball.body.torque.set(0, 0, 0);
        };
    }

    ball.strike = (cameraDirection, strikePower) => {
        let strikeForce = new THREE.Vector3();
        strikeForce.x = cameraDirection.x; 
        strikeForce.z = cameraDirection.z; 
        strikeForce.normalize().multiplyScalar(strikePower);
        ball.body.applyForce(strikeForce);
    };

    return ball;
}

function createBallTouchSphere() {
    const radius = 0.2; //meters
    const widthSegments = 32;
    const heightSegments = 16;
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const material = new THREE.MeshStandardMaterial({
        color: 'red',
        wireframe: true,
        visible: false,
    });

    const ballTouchSphere = {
        mesh: new THREE.Mesh(geometry, material),
    }

    return ballTouchSphere;
}

export { createBall };
