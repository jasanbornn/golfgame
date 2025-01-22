import { createBarrier } from '../obstacles/barrier.js';
import { createGround } from '../ground.js';
import { createHole } from '../hole.js';
import { createFlag } from '../flag.js';

import { createSceneryGround } from '../scenery/sceneryGround.js';

import * as THREE from '../../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';

function createCourse1() {

    const sceneryGround = createSceneryGround(new THREE.Vector3(0.0, -0.3, 0.0));

    const hole = createHole(new THREE.Vector3(0, 0, -3.5));
    const flag = createFlag(hole.position);
    const ballSpawnpoint = new THREE.Vector3(0, 0.1, 3.5);
    const cameraSpawnpoint = new THREE.Vector3(0, 1, 5.5);
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
        ballSpawnpoint: ballSpawnpoint,
        cameraSpawnpoint: cameraSpawnpoint,
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
        flag,
        sceneryGround,
    ];

    course.tick = (delta) => {};

    for(let groundSection of groundSections) {
        course.objects.push(groundSection);
    }

    for(let barrier of barriers) {
        course.objects.push(barrier);
    }

    return course;
}

export { createCourse1 };
