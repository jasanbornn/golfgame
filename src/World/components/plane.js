import * as THREE from '../../../vendor/three/build/three.module.js';
import { Body, Plane, Vec3 } from 'https://cdn.skypack.dev/cannon-es@0.20.0';


function createPlane() {

    const geometry = new THREE.PlaneGeometry(32, 32);
    const material = createMaterial();
    const plane = {
        mesh: new THREE.Mesh(geometry, material),
        body: new Body({
            type: Body.STATIC,
            shape: new Plane(),
        }),
    };

    plane.body.position.set(0, 0, 0);
    plane.body.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // face plane upwards

    plane.mesh.position.copy(plane.body.position);
    plane.mesh.quaternion.copy(plane.body.quaternion);

    return plane;
}

function createMaterial() {

//    return new MeshStandardMaterial({
//        color: 'darkgreen',
//    });

    const textureLoader = new THREE.TextureLoader();

    const texture = textureLoader.load(
        '../../assets/dev-texture.png',
    );

    const material = new THREE.MeshStandardMaterial({
        map: texture,
    });

    return material;
    
}

export { createPlane };
