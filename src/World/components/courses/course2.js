import { createBarrier } from '../obstacles/barrier.js';
import { createGround } from '../ground.js';
import { createHole } from '../hole.js';
import { createFlag } from '../flag.js';

import * as THREE from '../../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';

function createCourse2(physMaterials) {

    const hole = createHole(new THREE.Vector3(-3, -0.001, -3));
    const flag = createFlag(new THREE.Vector3(-3, 0, -3));
    const holeGroundSection = createGround(
        1,
        5,
        new THREE.Vector3(-1.62, -0.001, -1.62),
        new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0.0, 1.0, 0.0),
            Math.PI / 4,
        ),
        hole,
    );
    const groundSections = [
        holeGroundSection,
        createGround(
            1,
            4,
            new THREE.Vector3(0.0, 0.0, 1.8),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            ),
        )
    ];

    const barriers = [
        createBarrier(
            1,
            new THREE.Vector3(0.0, 0.0, 3.8),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI,
            ),
            false,
        ),
        createBarrier(
            4,
            new THREE.Vector3(0.49, 0.0, 1.8),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                -Math.PI / 2,
            ),
            false,
        ),
        createBarrier(
            5,
            new THREE.Vector3(-1.27, 0.0, -1.97),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                -Math.PI / 4,
            ),
            false,
        ),
        createBarrier(
            1,
            new THREE.Vector3(-3.385, 0.0, -3.385),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI / 4,
            ),
            false,
        ),
        createBarrier(
            4.56,
            new THREE.Vector3(-2.13, 0.0, -1.425),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                -5 * Math.PI / 4,
            ),
            false,
        ),
        createBarrier(
            3.575,
            new THREE.Vector3(-0.5, 0.0, 2.015),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI / 2,
            ),
            false,
        ),
    ];
    
    const course = { 
        ballSpawnpoint: new THREE.Vector3(0, 0.1, 3.5),
        cameraSpawnpoint: new THREE.Vector3(0, 1, 5),
        hole: hole,
        par: 2,
        holeGroundSection: holeGroundSection,
        groundSections: groundSections,
        barriers: barriers,
    }

    course.objects = [
        course.hole,
        course.hole.trigger,
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

export { createCourse2 };
