import * as THREE from '../../../vendor/three/build/three.module.js';
//import { OrbitControls } from 'https://cdn.skypack.dev/three@0.163.0/examples/jsm/controls/OrbitControls.js';
import { OrbitControls } from '../../../vendor/OrbitControls.js';

const baseTarget = {
    position: new THREE.Vector3(0, 0, 0),
};

function createControls(camera, canvas) {
    const controls = new OrbitControls(camera, canvas);
    controls.enablePan = false;
    controls.targetObj = baseTarget;
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = Math.PI / 2;

    controls.tick = (delta) => {
        controls.target.copy(controls.targetObj.position); 
        controls.update(delta);
    };

    return controls;
}

export { createControls };
