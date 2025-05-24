import { createLight } from '../light.js';
import { createBarrier } from '../obstacles/barrier.js';
import { createGround } from '../ground.js';
import { createHole } from '../hole.js';
import { createFlag } from '../flag.js';
import { createWindmillBase, createWindmillBlades } from '../obstacles/windmill.js';

import { createOutOfBoundsPlane } from '../debug/outOfBoundsPlane.js';

import { createSceneryGround } from '../scenery/sceneryGround.js';
import { createTrees } from '../scenery/trees.js';

import * as THREE from '../../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';

function createCourse5(physMaterials) {

    const clearingPosition = new THREE.Vector3(0.0, 0.0, 0.0);
    const clearingRadius = 10.0;
    const groundHeight = -0.33;

    const light = createLight(new THREE.Vector3(9, 5, 2));
    const sceneryGround = createSceneryGround(new THREE.Vector3(0.0, groundHeight, 0.0));
    const trees = createTrees(clearingPosition, clearingRadius, groundHeight);

    const hole = createHole(new THREE.Vector3(0.0, 0.0, -6.0));
    const flag = createFlag(hole.position);
    const ballSpawnpoint = new THREE.Vector3(0.0, 0.1, 0.3);
    const cameraSpawnpoint = new THREE.Vector3(0.0, 2.0, 4.0);
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
            3,
            3,
            new THREE.Vector3(0.0, 0.0, -6.0),
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
            2.0,
            2.0,
            new THREE.Vector3(0.0, 0.0, 0.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            )
        ),
        //bridge
        createGround(
            2.0,
            3.5,
            new THREE.Vector3(0.0, 0.0, -2.75),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            )
        ),
    ];

    const barriers = [
        //back
        createBarrier(
            3,
            new THREE.Vector3(0.0, 0.0, -7.5),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            ),
        ),
        //left
        createBarrier(
            3,
            new THREE.Vector3(-1.5, 0.0, -6.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI / 2,
            ),
        ),
        //right
        createBarrier(
            3,
            new THREE.Vector3(1.5, 0.0, -6.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                -Math.PI / 2,
            ),
        ),
    ];

    const course = {
        ballSpawnpoint: ballSpawnpoint,
        cameraSpawnpoint: cameraSpawnpoint,
        hole: hole,
        par: 2,
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

    for(const tree of trees) {
        course.objects.push(tree);
    }

    return course;

}

export { createCourse5 };
