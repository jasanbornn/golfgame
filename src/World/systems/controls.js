import { Vector3 } from 'https://cdn.skypack.dev/three@0.132.2';
//import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';
import { OrbitControls } from '../../../vendor/OrbitControls.js';

const baseTarget = {
    position: new Vector3(0, 0, 0),
};

function createControls(camera, canvas) {
    const controls = new OrbitControls(camera, canvas);

    controls.enablePan = false;

    controls.maxTargetRadius = 3.0;

    controls.targetObj = baseTarget;

    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = Math.PI / 2;

    controls.tick = (delta) => {
        controls.target.copy(controls.targetObj.position); 
        controls.update();
    };

    return controls;
}

export { createControls };
