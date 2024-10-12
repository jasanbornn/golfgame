import { createBarrier } from '../obstacles/barrier.js';
import { createGround } from '../ground.js';
import { createHole } from '../hole.js';

import * as THREE from '../../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';

function createCourse1() {

    const hole = createHole(new THREE.Vector3(0, 0, -3.5));
    const holeGroundSection = createGround(
        1,
        8,
        new THREE.Vector3(0, 0, 0),
        new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0.0, 1.0, 0.0),
            0,
        ),
        hole,
    );
    const groundSections = [
        holeGroundSection,
    ];

    const barriers = [
        createBarrier(
            1.0,
            new THREE.Vector3(0.0, 0.0, 4.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI,
            ),
        ),
        createBarrier(
            1.0,
            new THREE.Vector3(0.0, 0.0, -4.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            ),
        ),
        createBarrier(
            8.0,
            new THREE.Vector3(0.5, 0.0, 0.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                -Math.PI / 2,
            ),
        ),
        createBarrier(
            8.0,
            new THREE.Vector3(-0.5, 0.0, 0.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI / 2,
            ),
        ),
    ];

    const course = {
        ballSpawnpoint: new THREE.Vector3(0, 0.1, 3),
        cameraSpawnpoint: new THREE.Vector3(0, 1, 5),
        hole: hole,
        par: 1,
        holeGroundSection: holeGroundSection,
        groundSections: groundSections,
        barriers: barriers,
    };

    course.objects = [
        course.hole,
        course.hole.collideTrigger,
        course.hole.inTrigger,
    ];

    for(let groundSection of groundSections) {
        course.objects.push(groundSection);
    }

    for(let barrier of barriers) {
        course.objects.push(barrier);
    }

    return course;
}

export { createCourse1 };
