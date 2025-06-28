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
        0.038, // near clipping plane
        100, // far clipping plane
    );

    camera.name = "camera";

    // move the camera back so we can view the scene
    camera.position.set(0, 2, 2);
    camera.quaternion.setFromEuler(new THREE.Euler(-Math.PI / 16, 0, 0));

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

        //todo
        //check all collisions between the targetObj (ball) and camera
        //find the first collsion from the ball's perspective
        //then move the camera to that collision point
        //so the camera doesn't get stuck in or behind objects
        
        //const raycastDirection = new THREE.Vector3();
        //camera.getWorldDirection(raycastDirection).negate().normalize();

        //const raycaster = new THREE.Raycaster(
        //    camera.targetObj.position,
        //    raycastDirection,
        //);

        //const intersections = raycaster.intersectObject(camera, false);

        //if(intersections.length) {
        //    camera.position.copy(intersections[0].point);
        //}
    };

    return camera;
}

export { createCamera };

