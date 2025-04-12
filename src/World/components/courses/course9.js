import { createLight } from '../light.js';
import { createBarrier } from '../obstacles/barrier.js';
import { createGround } from '../ground.js';
import { createHole } from '../hole.js';
import { createFlag } from '../flag.js';

import { createOutOfBoundsPlane } from '../debug/outOfBoundsPlane.js';

import { createSceneryGround } from '../scenery/sceneryGround.js';
import { createTrees } from '../scenery/trees.js';

import * as THREE from '../../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';

function createCourse9(physMaterials) {

    const clearingPosition = new THREE.Vector3(0.0, 0.0, -6.5);
    const clearingRadius = 10.0;
    const groundHeight = -0.2;

    const light = createLight(new THREE.Vector3(5, 5, -6));
    const sceneryGround = createSceneryGround(new THREE.Vector3(0.0, groundHeight, 0.0));
    const trees = createTrees(clearingPosition, clearingRadius, groundHeight);

    const hole = createHole(new THREE.Vector3(0.0, 1.0, -3.4));
    const flag = createFlag(hole.position);
    const ballSpawnpoint = new THREE.Vector3(0.0, 3.1, 0.0);
    const cameraSpawnpoint = new THREE.Vector3(0.0, 4.0, 2.0);
    const outOfBoundsYLevel = -0.1;
    const outOfBoundsPlane = createOutOfBoundsPlane(outOfBoundsYLevel);

    const holeGroundSection = createGround(
            1.5,
            1.5,
            new THREE.Vector3(0.0, 1.0, -3.65),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            ),
            hole,
        );

    const groundSections = [
        //starting ground
        createGround(
            1,
            3,
            new THREE.Vector3(0.0, 3.0, -1.3),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            )
        ),
        //first bump ramp
        createGround(
            1,
            0.1118,
            new THREE.Vector3(0.0, 3.025, -2.85),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(1.0, 0.0, 0.0),
                0.4636,
            )
        ),
        //first forward landing
        createGround(
            2,
            4,
            new THREE.Vector3(0.0, 1.0, -11.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            )
        ),
        //first foward landing back board
        createGround(
            2.0,
            0.5,
            new THREE.Vector3(0.0, 2.5, -13.25),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            )
        ),
        //second reverse bump ramp
        createGround(
            2,
            0.1118,
            new THREE.Vector3(0.0, 1.025, -8.95),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI,
            ).multiply(new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(1.0, 0.0, 0.0),
                0.4636,
            ),
        )),
        holeGroundSection,
    ];

    const barriers = [
        //flag barrier
        createBarrier(
            1.5,
            new THREE.Vector3(0.0, 1.0, -4.35),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            ),
        ),
        //flag barrier
        createBarrier(
            1.5,
            new THREE.Vector3(-0.75, 1.0, -3.65),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI / 2,
            ),
        ),
        //flag barrier
        createBarrier(
            1.5,
            new THREE.Vector3(0.75, 1.0, -3.65),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                -Math.PI / 2,
            ),
        ),
        //back barrier 1
        createBarrier(
            0.27,
            new THREE.Vector3(0.64, 1.0, -2.85),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            ),
        ),
        //back barrier 2
        createBarrier(
            0.27,
            new THREE.Vector3(-0.64, 1.0, -2.85),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            ),
        ),

    ];

    const course = {
        ballSpawnpoint: ballSpawnpoint,
        cameraSpawnpoint: cameraSpawnpoint,
        hole: hole,
        par: 3,
        holeGroundSection: holeGroundSection,
        groundSections: groundSections,
        barriers: barriers,
        outOfBoundsYLevel: outOfBoundsYLevel,
    }

    course.objects = [
        light,
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

    for(const tree of trees) {
        course.objects.push(tree);
    }

    return course;

}

export { createCourse9 };
