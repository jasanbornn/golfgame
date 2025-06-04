import { createLight } from '../light.js';
import { createBarrier } from '../obstacles/barrier.js';
import { createWedge } from '../obstacles/wedge.js';
import { createGround } from '../ground.js';
import { createCup } from '../cup.js';
import { createFlag } from '../flag.js';

import { createOutOfBoundsPlane } from '../debug/outOfBoundsPlane.js';

import { createSceneryGround } from '../scenery/sceneryGround.js';
import { createTrees } from '../scenery/trees.js';

import * as THREE from '../../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';

function createHole6(physMaterials) {

    const clearingPosition = new THREE.Vector3(0.0, 0.0, -3.0);
    const clearingRadius = 10.0;
    const groundHeight = -0.2;

    const light = createLight(new THREE.Vector3(9, 3, 2));
    const sceneryGround = createSceneryGround(new THREE.Vector3(0.0, groundHeight, 0.0));
    const trees = createTrees(clearingPosition, clearingRadius, groundHeight);

    const cup = createCup(new THREE.Vector3(0.0, 0.497, -7.0));
    const flag = createFlag(cup.position);
    const ballSpawnpoint = new THREE.Vector3(0.0, 0.8, 0.3);
    const cameraSpawnpoint = new THREE.Vector3(0.0, 1.5, 3.0);
    const outOfBoundsYLevel = 0.0;
    const outOfBoundsPlane = createOutOfBoundsPlane(outOfBoundsYLevel);

    const wedge = createWedge(
        0.3,
        0.3,
        new THREE.Vector3(0.0, 1.0, -0.72),
        new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0.0, 1.0, 0.0),
            -Math.PI / 4,
        ),
    );

    const cupGroundSection = createGround(
            2,
            2,
            new THREE.Vector3(0.0, 0.497, -7.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            ),
            cup,
        );

    const groundSections = [
        //cup + landing
        cupGroundSection,
        //start
        createGround(
            1,
            1,
            new THREE.Vector3(0.0, 0.75, 0.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            ),
        ),
        //top middle landing
        createGround(
            5,
            1,
            new THREE.Vector3(0.0, 0.5, -1.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            )
        ),
        //right landing
        createGround(
            1,
            2,
            new THREE.Vector3(3.0, 0.5, -0.5),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            )
        ),
        //left landing
        createGround(
            1,
            2,
            new THREE.Vector3(-3.0, 0.5, -0.5),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            )
        ),

        //right ramp
        createGround(
            1,
            2.02,
            new THREE.Vector3(1.5, 0.625, 0.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI / 2,
            ).multiply(
                new THREE.Quaternion().setFromAxisAngle(
                    new THREE.Vector3(1.0, 0.0, 0.0),
                    0.124,
                )
            ),
        ),
        //left ramp
        createGround(
            1,
            2.02,
            new THREE.Vector3(-1.5, 0.625, 0.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                -Math.PI / 2,
            ).multiply(
                new THREE.Quaternion().setFromAxisAngle(
                    new THREE.Vector3(1.0, 0.0, 0.0),
                    0.124,
                )
            ),
        ),
        //right bridge
        createGround(
            5.8,
            1.25,
            new THREE.Vector3(1.6, 0.499, -3.75),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                41 * Math.PI / 64,
            ),
        ),
        //left bridge
        createGround(
            5.8,
            1.25,
            new THREE.Vector3(-1.6, 0.498, -3.75),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                23 * Math.PI / 64,
            ),
        ),

    ];

    const barriers = [
        createBarrier(
            2,
            new THREE.Vector3(3.5, 0.5, -0.5),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                -Math.PI / 2,
            ),
        ),
        createBarrier(
            2,
            new THREE.Vector3(-3.5, 0.5, -0.5),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI / 2,
            ),
        ),
        createBarrier(
            2,
            new THREE.Vector3(0.0, 0.5, -8.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            ),
        ),
    ];

    const hole = {
        ballSpawnpoint: ballSpawnpoint,
        cameraSpawnpoint: cameraSpawnpoint,
        cup: cup,
        trees: trees,
        par: 3,
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

    for(const tree of trees.treeObjects) {
        hole.objects.push(tree);
    }

    return hole;

}

export { createHole6 };
