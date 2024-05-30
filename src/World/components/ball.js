import * as THREE from '../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';

function createBall() {
    const materialSpec = {
        color: 0xBBBBBB,
    }

    const radius = 0.042; //meters
    const widthSegments = 32;
    const heightSegments = 16;
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const material = new THREE.MeshStandardMaterial(materialSpec);

    const ball = {
        mesh: new THREE.Mesh(geometry, material),
        body: new CANNON.Body({
            mass: 0.045, //kg
            shape: new CANNON.Sphere(radius),
            angularDamping: 0.80,
        }),
    };

    //ball.body.position.set(0, 0.1, 0);
    ball.body.position.set(0, 2, 0);
    ball.body.quaternion.setFromEuler(-0.5, -0.1, 0.8);

    ball.mesh.position.copy(ball.body.position);
    ball.mesh.quaternion.copy(ball.body.quaternion);

    ball.tick = (delta) => {
        ball.mesh.position.copy(ball.body.position);
        ball.mesh.quaternion.copy(ball.body.quaternion);

        if (ball.body.velocity.length() < 0.8 && ball.body.velocity.y < 0.01) {
            const temp = ball.body.velocity.y;
            ball.body.velocity.scale(0.98,ball.body.velocity);
            ball.body.velocity.y = temp;
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

export { createBall };
