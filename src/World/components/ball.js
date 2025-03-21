import * as THREE from '../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';
function createBall() {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.path = 'putt';
    const createMaterial = () => {
        textureLoader.load(
            '/../assets/golfball.jpg',
            (texture) => { 
                ball.mesh.material = new THREE.MeshPhysicalMaterial({
                    normalMap: texture,
                    normalScale: new THREE.Vector2(1.0, 1.0),
                    roughness: 0.0,
                    clearcoat: 1.0,
                    metalness: 0.7,
                });
            },
        );
    }

    //create ball
    const radius = 0.042; //meters
    const widthSegments = 32;
    const heightSegments = 16;
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const material = new THREE.MeshStandardMaterial();
    const physMaterial = new CANNON.Material('ball');


    let isMoving = false;
    let isSettled = true;
    const settleClock = new THREE.Clock(false); //autostart = false;

    const ball = {
        mesh: new THREE.Mesh(geometry, material),
        body: new CANNON.Body({
            mass: 0.046, //kg
            shape: new CANNON.Sphere(radius),
            material: physMaterial,
            angularDamping: 0.70,
        }),
    };
    createMaterial();

    ball.mesh.name = "ball";

    ball.body.material = new CANNON.Material({
        friction: 0.3,
        restitution: 0.9,
    });

    ball.touchSphere = createBallTouchSphere();

    //position ball
    ball.body.position.set(0, 2, 0);
    ball.body.quaternion.setFromEuler(-0.5, -0.1, 0.8);
    ball.mesh.position.copy(ball.body.position);
    ball.mesh.quaternion.copy(ball.body.quaternion);

    const lastPosition = new THREE.Vector3().copy(ball.body.position);

    ball.updateTouchSphere = () => {};
    ball.onSettling = () => {};

    const prevVelocity = new THREE.Vector3();

    ball.velocityChange = new THREE.Vector3();
    ball.tick = (delta) => {
        const velocityChange = new THREE.Vector3().copy(ball.body.velocity.vsub(prevVelocity));
        ball.velocityChange.copy(velocityChange);

        if (velocityChange.length() > 0.1) {
            //console.log(velocityChange.length());
        }

        if (ball.body.velocity.length() > 0.10) {
            isMoving = true;
            isSettled = false;
            settleClock.start();
            settleClock.stop();
        } else if (ball.body.velocity.length() < 0.01) {
            if (isMoving) {
                isMoving = false;
                settleClock.start();
            }
            if (settleClock.getElapsedTime() >= 0.50) {
                settleClock.start();
                settleClock.stop();
                isSettled = true;
                ball.onSettling();
            }
        }

        ball.mesh.position.copy(ball.body.position);
        ball.mesh.quaternion.copy(ball.body.quaternion);
        ball.touchSphere.mesh.position.copy(ball.mesh.position);
        ball.updateTouchSphereScale();
        prevVelocity.copy(ball.body.velocity);

        if (ball.body.velocity.length() < 0.2) {
            ball.body.angularDamping = 0.9;
        } else {
            ball.body.angularDamping = 0.7; 
        }

        if (ball.body.position.y < -10.0) {
            ball.toLastPosition();
            ball.mesh.position.copy(ball.body.position);
        };
    }

    ball.strike = (cameraDirection, strikePower) => {
        let strikeForce = new THREE.Vector3();
        strikeForce.x = cameraDirection.x; 
        strikeForce.z = cameraDirection.z; 
        strikeForce.normalize().multiplyScalar(strikePower);
        ball.body.applyForce(strikeForce);
    };

    ball.stop = () => {
        ball.body.velocity.set(0.0, 0.0, 0.0);
        ball.body.angularVelocity.set(0.0, 0.0, 0.0);
    }

    ball.recordPosition = () => {
        lastPosition.copy(ball.body.position);
    }

    ball.toLastPosition = () => {
        ball.stop();
        ball.body.position.copy(lastPosition);
        ball.mesh.position.copy(lastPosition);
    }

    ball.isSettled = () => { return isSettled; }
    ball.isMoving = () => { return isMoving; }

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
