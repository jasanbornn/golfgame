import { createBarrier } from './obstacles/barrier.js';
import { createGround } from './ground.js';
import { createHole } from './hole.js';

import { createCourse1 } from './courses/course1.js';
import { createCourse2 } from './courses/course2.js';
import { createCourse3 } from './courses/course3.js';
import { createCourse4 } from './courses/course4.js';
import { createCourse5 } from './courses/course5.js';
import { createCourse6 } from './courses/course6.js';
import { createCourse7 } from './courses/course7.js';
import { createCourse8 } from './courses/course8.js';
import { createCourse9 } from './courses/course9.js';

import * as THREE from '../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';
function createCourse(courseNum) {
    let course;
    const physMaterials = {
        barrier: new CANNON.Material('barrier'),
    }

    switch(courseNum) {
        case 1:
            course = createCourse1(physMaterials);
            break;
        case 2:
            course = createCourse2(physMaterials);
            break;
        case 3:
            course = createCourse3(physMaterials);
            break;
        case 4:
            course = createCourse4(physMaterials);
            break;
        case 5:
            course = createCourse5(physMaterials);
            break;
        case 6:
            course = createCourse6(physMaterials);
            break;
        case 7:
            course = createCourse7(physMaterials);
            break;
        case 8:
            course = createCourse8(physMaterials);
            break;
        case 9:
            course = createCourse9(physMaterials);
            break;
        default:
            course = createCourse1(physMaterials);
            break;
    }

    course.number = courseNum;

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

