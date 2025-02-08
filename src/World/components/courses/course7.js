import { createBarrier } from '../obstacles/barrier.js';
import { createGround } from '../ground.js';
import { createHole } from '../hole.js';
import { createFlag } from '../flag.js';

import { createOutOfBoundsPlane } from '../debug/outOfBoundsPlane.js';

import { createSceneryGround } from '../scenery/sceneryGround.js';

import * as THREE from '../../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';

function createCourse7(physMaterials) {

    const sceneryGround = createSceneryGround(new THREE.Vector3(0.0, -0.2, 0.0));
    const hole = createHole(new THREE.Vector3(0.0, 1.0, -4.0));
    const flag = createFlag(hole.position);
    const ballSpawnpoint = new THREE.Vector3(0.0, 2.1, 0.0);
    const cameraSpawnpoint = new THREE.Vector3(0.0, 2.5, 3.0);
    const outOfBoundsYLevel = 0.0;
    const outOfBoundsPlane = createOutOfBoundsPlane(outOfBoundsYLevel);

    const holeGroundSection = createGround(
            1,
            1,
            new THREE.Vector3(0.0, 1.0, -4.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            ),
            hole,
        );

    const groundSections = [
        holeGroundSection,
        createGround(
            1,
            1,
            new THREE.Vector3(0.0, 2.0, 0.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            )
        ),
        createGround(
            1,
            3,
            new THREE.Vector3(0.0, 0.5, -2.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            )
        ),
        createGround(
            1,
            1,
            new THREE.Vector3(-1.0, 1.0, -3.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            )
        ),
        createGround(
            2,
            2,
            new THREE.Vector3(-1.5, 0.5, -1.5),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            )
        ),
        createGround(
            1,
            1,
            new THREE.Vector3(-2.0, 0.75, -4.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            )
        ),
        //slopes
        createGround(
            1,
            1.031,
            new THREE.Vector3(-2.0, 0.625, -3.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(1.0, 0.0, 0.0),
                0.245,
            )
        ),
        createGround(
            1,
            1.031,
            new THREE.Vector3(-1.0, 0.875, -4.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                -Math.PI / 2,
            ).multiply(
                new THREE.Quaternion().setFromAxisAngle(
                    new THREE.Vector3(1.0, 0.0, 0.0),
                    0.245,
                ),
            ),
        ),
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
        ballSpawnpoint: ballSpawnpoint,
        cameraSpawnpoint: cameraSpawnpoint,
        hole: hole,
        par: 1,
        holeGroundSection: holeGroundSection,
        groundSections: groundSections,
        barriers: barriers,
        outOfBoundsYLevel: outOfBoundsYLevel,
    }

    course.objects = [
        course.hole,
        course.hole.collideTrigger,
        course.hole.inTrigger,
        flag,
        sceneryGround,
        outOfBoundsPlane,
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

export { createCourse7 };
