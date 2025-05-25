import { createLight } from '../light.js';
import { createBarrier } from '../obstacles/barrier.js';
import { createGround } from '../ground.js';
import { createCup } from '../cup.js';
import { createFlag } from '../flag.js';

import { createOutOfBoundsPlane } from '../debug/outOfBoundsPlane.js';

import { createSceneryGround } from '../scenery/sceneryGround.js';
import { createTrees } from '../scenery/trees.js';

import * as THREE from '../../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';

function createHole2(physMaterials) {

    const clearingPosition = new THREE.Vector3(0.0, 0.0, 0.0);
    const clearingRadius = 10.0;
    const groundHeight = -0.33;

    const light = createLight(new THREE.Vector3(-0.5, 6, 10));
    const sceneryGround = createSceneryGround(new THREE.Vector3(0.0, groundHeight, 0.0));
    const trees = createTrees(clearingPosition, clearingRadius, groundHeight);

    const cup = createCup(new THREE.Vector3(-3, -0.001, -3));
    const flag = createFlag(cup.position);
    const ballSpawnpoint = new THREE.Vector3(0, 0.1, 3.5);
    const cameraSpawnpoint = new THREE.Vector3(0, 1.5, 7.5);
    const outOfBoundsYLevel = -0.15;
    const outOfBoundsPlane = createOutOfBoundsPlane(outOfBoundsYLevel);

    const cupGroundSection = createGround(
        1,
        5,
        new THREE.Vector3(-1.62, -0.001, -1.62),
        new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0.0, 1.0, 0.0),
            Math.PI / 4,
        ),
        cup,
    );
    const groundSections = [
        cupGroundSection,
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
        ),
        createBarrier(
            4,
            new THREE.Vector3(0.49, 0.0, 1.8),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                -Math.PI / 2,
            ),
        ),
        createBarrier(
            5,
            new THREE.Vector3(-1.27, 0.0, -1.97),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                -Math.PI / 4,
            ),
        ),
        createBarrier(
            1,
            new THREE.Vector3(-3.385, 0.0, -3.385),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI / 4,
            ),
        ),
        createBarrier(
            4.56,
            new THREE.Vector3(-2.13, 0.0, -1.425),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                -5 * Math.PI / 4,
            ),
        ),
        createBarrier(
            3.575,
            new THREE.Vector3(-0.5, 0.0, 2.015),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI / 2,
            ),
        ),
    ];
    
    const hole = { 
        ballSpawnpoint: ballSpawnpoint,
        cameraSpawnpoint: cameraSpawnpoint,
        cup: cup,
        par: 2,
        cupGroundSection: cupGroundSection,
        groundSections: groundSections,
        barriers: barriers,
        outOfBoundsYLevel: outOfBoundsYLevel, 
    }

    hole.objects = [
        light,
        hole.cup,
        hole.cup.collideTrigger,
        hole.cup.inTrigger,
        flag,
        sceneryGround,
        outOfBoundsPlane,
    ];

    hole.tick = (delta) => {};

    for(let groundSection of groundSections) {
        hole.objects.push(groundSection);
    }

    for(let barrier of barriers) {
        hole.objects.push(barrier); 
    }

    for(const tree of trees) {
        hole.objects.push(tree);
    }

    return hole;
}

export { createHole2 };
