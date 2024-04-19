import { 
    Euler,
    SphereGeometry, 
    MathUtils, 
    Mesh, 
    MeshStandardMaterial,
    Vector3
} from 'https://cdn.skypack.dev/three@0.132.2';

import { Body, Sphere, Vec3 } from 'https://cdn.skypack.dev/cannon-es@0.20.0';

function createSphere() {
    const materialSpec = {
        color: 'purple',
    }

    const radius = 0.042; //meters
    const widthSegments = 32;
    const heightSegments = 16;
    const geometry = new SphereGeometry(radius, widthSegments, heightSegments);
    const material = new MeshStandardMaterial(materialSpec);

    const sphere = {
        mesh: new Mesh(geometry, material),
        body: new Body({
            mass: 5, //kg
            shape: new Sphere(radius),
            angularDamping: 0.8,
        }),
    };

    sphere.body.position.set(0, 1, 0);
    sphere.body.quaternion.setFromEuler(-0.5, -0.1, 0.8);

    sphere.mesh.position.copy(sphere.body.position);
    sphere.mesh.quaternion.copy(sphere.body.quaternion);

    sphere.tick = (delta) => {
        sphere.mesh.position.copy(sphere.body.position);
        sphere.mesh.quaternion.copy(sphere.body.quaternion);
    };

    sphere.strike = (cameraDirection) => {
        sphere.body.applyForce(cameraDirection.multiplyScalar(1000));
    };

    return sphere;
}

export { createSphere };
