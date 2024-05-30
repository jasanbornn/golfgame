import { createWedge } from './obstacles/wedge.js';
import { createGround } from './ground.js';
import { createHole } from './hole.js';
import { createHoleTrigger } from './holeTrigger.js';

import * as THREE from '../../../vendor/three/build/three.module.js';
function createCourse(width, height) {

    const wedge = createWedge();
    
    const hole = createHole(32);
    const holeTrigger = createHoleTrigger(hole);
    const ground = createGround(width, height, hole);

    const course = {
        ballSpawnpoint: new THREE.Vector3(0, 2, 3),
        wedge: wedge,
        hole: hole,
        holeTrigger: holeTrigger,
        ground: ground,
        models: [
            wedge.mesh,
            ground.mesh,
            hole.mesh,
            //holeTrigger.mesh,
        ],
        physObjects: [
            wedge.body,
            ground.body,
            hole.body,
            holeTrigger.body,
        ],
    };

    return course;

}

export { createCourse };

