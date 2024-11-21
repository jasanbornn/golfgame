import { createBarrier } from '../obstacles/barrier.js';
import { createGround } from '../ground.js';
import { createHole } from '../hole.js';
import { createFlag } from '../flag.js';

import * as THREE from '../../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';

function createCourse(physMaterials) {

    const hole = createHole(new THREE.Vector3(0.0, 0.0, 0.0));
    const flag = createFlag(hole.position);
    const holeGroundSection = createGround(
            1,
            1,
            new THREE.Vector3(0.0, 0.0, 0.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            ),
            hole,
        );

    const groundSections = [
        holeGroundSection,
        //createGround(
        //    1,
        //    1,
        //    new THREE.Vector3(0.0, 0.0, 0.0),
        //    new THREE.Quaternion().setFromAxisAngle(
        //        new THREE.Vector3(0.0, 1.0, 0.0),
        //        0,
        //    )
        //),
    ];

    const barriers = [
        //createBarrier(
        //    1,
        //    new THREE.Vector3(0.0, 0.0, 0.0),
        //    new THREE.Quaternion().setFromAxisAngle(
        //        new THREE.Vector3(0.0, 1.0, 0.0),
        //        0,
        //    ),
        //),
    ];

    const course = {
        ballSpawnpoint: new THREE.Vector3(0.0, 0.0, 0.0),
        cameraSpawnpoint: new THREE.Vector3(0.0, 0.0, 0.0),
        hole: hole,
        par: 1,
        holeGroundSection: holeGroundSection,
        groundSections: groundSections,
        barriers: barriers,
    }

    course.objects = [
        course.hole,
        course.hole.collideTrigger,
        course.hole.inTrigger,
        flag,
    ];

    for(let groundSection of groundSections) {
        course.objects.push(groundSection);
    }

    for(let barrier of barriers) {
        course.objects.push(barrier); 
    }

    return course;

}

export { createCourse };
