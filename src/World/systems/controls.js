import * as THREE from '../../../vendor/three/build/three.module.js';
//import { OrbitControls } from 'https://cdn.skypack.dev/three@0.163.0/examples/jsm/controls/OrbitControls.js';
import { OrbitControls } from '../../../vendor/OrbitControls.js';

const baseTarget = {
    position: new THREE.Vector3(0, 0, 0),
};

function createControls(camera, canvas) {
    const MIN_POLAR_ANGLE = Math.PI / 4;
    const MAX_POLAR_ANGLE = Math.PI / 2;
    const MIN_DISTANCE = 0.3; //meters
    const MAX_DISTANCE = 50.0; //meters

    const controls = new OrbitControls(camera, canvas);
    controls.enablePan = false;
    controls.targetObj = baseTarget;
    controls.minPolarAngle = MIN_POLAR_ANGLE;
    controls.maxPolarAngle = MAX_POLAR_ANGLE;
    controls.minDistance = MIN_DISTANCE;
    controls.maxDistance = MAX_DISTANCE;

    controls.lockVertical = (bool) => {
        const polarAngle = controls.getPolarAngle();
        if(bool) {
            controls.minPolarAngle = polarAngle;
            controls.maxPolarAngle = polarAngle;
        } else {
            controls.minPolarAngle = MIN_POLAR_ANGLE;
            controls.maxPolarAngle = MAX_POLAR_ANGLE;
        }
    };

    controls.invertHorizontal = (bool) => {
        if(bool) {
            controls.rotateSpeed = -0.5;
        } else {
            controls.rotateSpeed = 1.0;
        }
    };


    controls.tick = (delta) => {
        controls.target.copy(controls.targetObj.position); 
        controls.update();
    };

    return controls;
}

export { createControls };
