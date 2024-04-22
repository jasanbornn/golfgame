import * as THREE from '../../../vendor/three/build/three.module.js';
import { Vec3 } from 'https://cdn.skypack.dev/cannon-es@0.20.0';

const baseTarget = {
    position: new THREE.Vector3(0, 0, 0),
    velocity: new Vec3(0, 0, 0),
};

function createCamera() {
    const camera = new THREE.PerspectiveCamera(
        35, //fov
        1, //aspect ratio (dummy value to be resized later)
        0.1, // near clipping plane
        100, // far clipping plane
    );

    // move the camera back so we can view the scene
    camera.position.set(2, 2, 2);
    camera.quaternion.setFromEuler(new THREE.Euler(-Math.PI / 16, 0, 0))

    camera.targetObj = baseTarget;

    camera.tick = (delta) => {
        camera.position.x += camera.targetObj.velocity.x * delta;
        camera.position.y += camera.targetObj.velocity.y * delta;
        camera.position.z += camera.targetObj.velocity.z * delta;
    };

    return camera;
}

export { createCamera };

