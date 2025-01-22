import * as THREE from '../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';

const baseTarget = {
    position: new THREE.Vector3(0, 0, 0),
    velocity: new CANNON.Vec3(0, 0, 0),
};

function createCamera() {
    const camera = new THREE.PerspectiveCamera(
        75, //fov
        1, //aspect ratio (dummy value to be resized later)
        0.1, // near clipping plane
        100, // far clipping plane
    );

    // move the camera back so we can view the scene
    camera.position.set(0, 2, 2);
    camera.quaternion.setFromEuler(new THREE.Euler(-Math.PI / 16, 0, 0))

    camera.targetObj = baseTarget;

    const targetObjPrevPosition = new THREE.Vector3().copy(camera.targetObj.position);

    let resetting = false;
    camera.reset = () => {
        resetting = true; 
    }

    camera.tick = (delta) => {
        const targetObjCurrPosition = new THREE.Vector3().copy(camera.targetObj.position);
        const targetObjPosChange = targetObjCurrPosition.sub(targetObjPrevPosition);

        if(resetting) {
            targetObjPosChange.set(0.0, 0.0, 0.0);
            resetting = false;
        }

        camera.position.add(targetObjPosChange);
        
        targetObjPrevPosition.copy(camera.targetObj.position);
    };

    return camera;
}

export { createCamera };

