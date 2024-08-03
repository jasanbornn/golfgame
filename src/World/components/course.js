import { createBarrier } from './obstacles/barrier.js';
import { createGround } from './ground.js';
import { createHole } from './hole.js';

import * as THREE from '../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';
function createCourse(ballPosition, holePosition) {

    const hole = createHole(holePosition);
    const ground = createGround(2, 10, hole);

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
        ballSpawnpoint: ballPosition,
        hole: hole,
        ground: ground,
        barriers: barriers,
    };

    course.models = [ 
        course.ground.mesh,
        course.hole.mesh,
        northBarrier.mesh,
        southBarrier.mesh,
        westBarrier.mesh,
        eastBarrier.mesh,
    ];

    course.physObjects = [
        course.ground.body,
        course.hole.body,
        course.hole.trigger.body,
        northBarrier.body,
        southBarrier.body,
        westBarrier.body,
        eastBarrier.body,
    ];

    return course;

}

export { createCourse };

// course needs:
// ball spawn point
// hole location

// other course objects:
// the ground(s) (made of rectangular pieces)
// barriers

//course object structure:
//  *ball spawn point
//  *hole location
//  *objects (unordered)
//      *barriers
//      *ground
//      *obstacles
//      *scenery

