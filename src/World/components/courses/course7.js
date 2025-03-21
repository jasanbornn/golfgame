import { createLight } from '../light.js';
import { createBarrier } from '../obstacles/barrier.js';
import { createWedge } from '../obstacles/wedge.js'
import { createGround } from '../ground.js';
import { createHole } from '../hole.js';
import { createFlag } from '../flag.js';

import { createOutOfBoundsPlane } from '../debug/outOfBoundsPlane.js';

import { createSceneryGround } from '../scenery/sceneryGround.js';

import * as THREE from '../../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';

function createCourse7(physMaterials) {

    const light = createLight(new THREE.Vector3(9, 6, 10));
    const sceneryGround = createSceneryGround(new THREE.Vector3(0.0, -0.2, 0.0));
    const hole = createHole(new THREE.Vector3(3.5, 1.0, -8.0));
    const flag = createFlag(hole.position);
    const ballSpawnpoint = new THREE.Vector3(0.0, 6.1, 8.0);
    const cameraSpawnpoint = new THREE.Vector3(0.0, 7.0, 10.0);
    const outOfBoundsYLevel = -0.1;
    const outOfBoundsPlane = createOutOfBoundsPlane(outOfBoundsYLevel);

    const holeGroundSection = createGround(
            1.0,
            1.0,
            new THREE.Vector3(3.5, 1.0, -8.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            ),
            hole,
        );

    const groundSections = [
        holeGroundSection,
        //starting landing
        createGround(
            6,
            1,
            new THREE.Vector3(0.0, 6.0, 8.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            )
        ),
        //main down slope 
        createGround(
            6,
            15.52,
            new THREE.Vector3(0.0, 4.0, 0.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI,
            ).multiply(new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(1.0, 0.0, 0.0),
                0.2606,
            )),
        ),
        //bottom slope
        createGround(
            1,
            6.083,
            new THREE.Vector3(0.0, 1.5, -8.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI / 2,
            ).multiply(new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(1.0, 0.0, 0.0),
                0.165,
            )),
        ),
        //bottom wall
        createGround(
            1,
            6.00,
            new THREE.Vector3(0.0, 2.0, -9.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI / 2,
            ),
        ),
    ];

    const barriers = [
        //downslope left half angled out
        createBarrier(
            3.3,
            new THREE.Vector3(-1.5, 4.5, 2.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(1.0, 0.0, 0.0),
                -0.2606,
            ).multiply(new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                //0,
                -Math.PI/6,
            )),
            false,
        ),
        //downslope right half straight
        createBarrier(
            3.3,
            new THREE.Vector3(1.0, 3.47, -2.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(1.0, 0.0, 0.0),
                -0.2606,
            ),
            false,
        ),
        //flag left barrier
        createBarrier(
            1.0,
            new THREE.Vector3(3.5, 1.0, -8.5),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            ),
        ),
        //flag back barrier
        createBarrier(
            1.0,
            new THREE.Vector3(4.0, 1.0, -8.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI / 2,
            ),
        ),
        //flag right barrier
        createBarrier(
            1.0,
            new THREE.Vector3(3.5, 1.0, -7.5),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI,
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

    return course;

}

export { createCourse7 };
