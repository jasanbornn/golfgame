import * as THREE from '../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';


function createSphere() {
    const materialSpec = {
        color: 0xBBBBBB,
    }

    const radius = 0.042; //meters
    const widthSegments = 32;
    const heightSegments = 16;
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const material = new THREE.MeshStandardMaterial(materialSpec);

    const sphere = {
        mesh: new THREE.Mesh(geometry, material),
        body: new CANNON.Body({
            mass: 0.045, //kg
            shape: new CANNON.Sphere(radius),
            angularDamping: 0.90,
        }),
    };

    sphere.body.position.set(0, 0.1, 0);
    sphere.body.quaternion.setFromEuler(-0.5, -0.1, 0.8);

    sphere.mesh.position.copy(sphere.body.position);
    sphere.mesh.quaternion.copy(sphere.body.quaternion);

    sphere.tick = (delta) => {
        sphere.mesh.position.copy(sphere.body.position);
        sphere.mesh.quaternion.copy(sphere.body.quaternion);

        if (sphere.body.velocity.length() < 0.8 && sphere.body.velocity.y < 0.01) {
            const temp = sphere.body.velocity.y;
            sphere.body.velocity.scale(0.98,sphere.body.velocity);
            sphere.body.velocity.y = temp;
        };


    }

    sphere.strike = (cameraDirection, strikePower) => {
        let strikeForce = new THREE.Vector3();
        strikeForce.x = strikePower * cameraDirection.x; 
        strikeForce.z = strikePower * cameraDirection.z; 
        sphere.body.applyForce(strikeForce);
    };

    return sphere;
}

export { createSphere };
