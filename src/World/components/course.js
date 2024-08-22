import { createBarrier } from './obstacles/barrier.js';
import { createGround } from './ground.js';
import { createHole } from './hole.js';

import { createCourse1 } from './courses/course1.js';
import { createCourse2 } from './courses/course2.js';

import * as THREE from '../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';
function createCourse(courseNum) {
    let course;
    const physMaterials = {
        barrier: new CANNON.Material('barrier'),
    }

    if(courseNum == 1) {
        course = createCourse1(physMaterials);
    } else if (courseNum == 2) {
        course = createCourse2(physMaterials);
    }

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

