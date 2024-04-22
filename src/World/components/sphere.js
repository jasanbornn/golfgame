import * as THREE from '../../../vendor/three/build/three.module.js';
import { Body, Sphere, Vec3 } from 'https://cdn.skypack.dev/cannon-es@0.20.0';


function createSphere() {
    const materialSpec = {
        color: 'purple',
    }

    const radius = 0.042; //meters
    const widthSegments = 32;
    const heightSegments = 16;
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const material = new THREE.MeshStandardMaterial(materialSpec);

    const sphere = {
        mesh: new THREE.Mesh(geometry, material),
        body: new Body({
            mass: 0.045, //kg
            shape: new Sphere(radius),
            angularDamping: 0.70,
        }),
    };

    sphere.body.position.set(0, 1, 0);
    sphere.body.quaternion.setFromEuler(-0.5, -0.1, 0.8);

    sphere.mesh.position.copy(sphere.body.position);
    sphere.mesh.quaternion.copy(sphere.body.quaternion);

    sphere.tick = (delta) => {
        sphere.mesh.position.copy(sphere.body.position);
        sphere.mesh.quaternion.copy(sphere.body.quaternion);

        if(
            sphere.body.velocity.length() < 0.05
        ) {
            sphere.angularDamping = 0.99; 
        } else
        {
            sphere.angularDamping = 0.70;
        }
    };

    sphere.strike = (cameraDirection, strikePower) => {
        let strikeForce = new THREE.Vector3();
        strikeForce.x = strikePower * cameraDirection.x; 
        strikeForce.z = strikePower * cameraDirection.z; 
        sphere.body.applyForce(strikeForce);
    };

    return sphere;
}

export { createSphere };
