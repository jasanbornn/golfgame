import { createWedge } from './obstacles/wedge.js';
import { createBarrier } from './obstacles/barrier.js';
import { createGround } from './ground.js';
import { createHole } from './hole.js';
import { createHoleTrigger } from './holeTrigger.js';

import * as THREE from '../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';
function createCourse(width, height) {

    const wedge = createWedge();
    
    const hole = createHole(32);
    const holeTrigger = createHoleTrigger(hole);
    const ground = createGround(width, height, hole);

    const barrierMaterial = new CANNON.Material('barrier');
    const northBarrier = createBarrier(2 + 0.4); 
    northBarrier.setQuaternion(0, 1.0, 0, 0.0);
    northBarrier.setPosition(0, 0, 5);
    northBarrier.setPhysMaterial(barrierMaterial);

    const southBarrier = createBarrier(2 + 0.4);
    southBarrier.setQuaternion(0, 0.0, 0, 1.0);
    southBarrier.setPosition(0, 0, -5);
    southBarrier.setPhysMaterial(barrierMaterial);

    const westBarrier = createBarrier(10);
    westBarrier.setQuaternion(0, (1/Math.sqrt(2)), 0, -(1/Math.sqrt(2)));
    westBarrier.setPosition(1, 0, 0);
    westBarrier.setPhysMaterial(barrierMaterial);

    const eastBarrier = createBarrier(10);
    eastBarrier.setQuaternion(0, (1/Math.sqrt(2)), 0, (1/Math.sqrt(2)));
    eastBarrier.setPosition(-1, 0, 0);
    eastBarrier.setPhysMaterial(barrierMaterial);

    const barriers = [];
    barriers.push(northBarrier);
    barriers.push(southBarrier);
    barriers.push(westBarrier);
    barriers.push(eastBarrier);

    const course = {
        ballSpawnpoint: new THREE.Vector3(0, 2, 3),
        holeTrigger: holeTrigger,
        ground: ground,
        barriers: barriers,
        models: [
            ground.mesh,
        ],
        physObjects: [
            ground.body,
            holeTrigger.body,
        ],
    };

    course.models.push(hole.mesh);
    course.models.push(northBarrier.mesh);
    course.models.push(southBarrier.mesh);
    course.models.push(westBarrier.mesh);
    course.models.push(eastBarrier.mesh);

    course.physObjects.push(hole.body);
    course.physObjects.push(holeTrigger.body);
    course.physObjects.push(northBarrier.body);
    course.physObjects.push(southBarrier.body);
    course.physObjects.push(westBarrier.body);
    course.physObjects.push(eastBarrier.body);

    return course;

}

export { createCourse };

