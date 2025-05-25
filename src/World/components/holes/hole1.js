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

function createHole1() {

    const clearingPosition = new THREE.Vector3(0.0, 0.0, 0.0);
    const clearingRadius = 10.0;
    const groundHeight = -0.33;

    const light = createLight(new THREE.Vector3(1, 2, 3));
    const sceneryGround = createSceneryGround(new THREE.Vector3(0.0, groundHeight, 0.0));
    const trees = createTrees(clearingPosition, clearingRadius, groundHeight);

    const cup = createCup(new THREE.Vector3(0, 0, -3.5));
    const flag = createFlag(cup.position);
    const ballSpawnpoint = new THREE.Vector3(0, 0.1, 3.5);
    const cameraSpawnpoint = new THREE.Vector3(0, 1.5, 6.5);
    const outOfBoundsYLevel = -0.15;
    const outOfBoundsPlane = createOutOfBoundsPlane(outOfBoundsYLevel);


    const cupGroundSection = createGround(
        1,
        8,
        new THREE.Vector3(0, 0, 0),
        new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0.0, 1.0, 0.0),
            0,
        ),
        cup,
    );
    const groundSections = [
        cupGroundSection,
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

    const hole = {
        ballSpawnpoint: ballSpawnpoint,
        cameraSpawnpoint: cameraSpawnpoint,
        cup: cup,
        par: 1,
        cupGroundSection: cupGroundSection,
        groundSections: groundSections,
        barriers: barriers,
        outOfBoundsYLevel: outOfBoundsYLevel, 
    };

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

export { createHole1 };
