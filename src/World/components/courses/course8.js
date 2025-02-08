import { createBarrier } from '../obstacles/barrier.js';
import { createGround } from '../ground.js';
import { createHole } from '../hole.js';
import { createFlag } from '../flag.js';
import { createWindmillBase, createWindmillBlades } from '../obstacles/windmill.js';

import { createOutOfBoundsPlane } from '../debug/outOfBoundsPlane.js';

import { createSceneryGround } from '../scenery/sceneryGround.js';

import * as THREE from '../../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';

function createCourse8(physMaterials) {

    const sceneryGround = createSceneryGround(new THREE.Vector3(0.0, -0.2, 0.0));
    const hole = createHole(new THREE.Vector3(0.0, 0.0, -5.0));
    const flag = createFlag(hole.position);
    const ballSpawnpoint = new THREE.Vector3(0.0, 0.1, 0.3);
    const cameraSpawnpoint = new THREE.Vector3(0.0, 1.5, 3.0);
    const outOfBoundsYLevel = -0.1;
    const outOfBoundsPlane = createOutOfBoundsPlane(outOfBoundsYLevel);

    const windmillBase = createWindmillBase(
        new THREE.Vector3(0.0, 0.0, -3.0),
        new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0.0, 1.0, 0.0),
            0,
        ),
    );
    const windmillBlades = createWindmillBlades(
        windmillBase.mesh.position,
        windmillBase.mesh.quaternion,
    );

    const holeGroundSection = createGround(
            1,
            1,
            new THREE.Vector3(0.0, 0.0, -5.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            ),
            hole,
        );

    const groundSections = [
        holeGroundSection,
        createGround(
            2,
            2,
            new THREE.Vector3(0.0, 0.0, 0.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            )
        ),
        createGround(
            0.9,
            3.5,
            new THREE.Vector3(0.0, 0.0, -2.75),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            )
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
        windmillBase,
        windmillBlades,
        outOfBoundsPlane,
    ];

    course.tick = (delta) => {
        windmillBlades.tick(delta);
    }

    for(let groundSection of groundSections) {
        course.objects.push(groundSection);
    }

    for(let barrier of barriers) {
        course.objects.push(barrier); 
    }

    return course;

}

export { createCourse8 };
