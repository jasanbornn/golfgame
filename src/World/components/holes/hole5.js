import { createLight } from '../light.js';
import { createBarrier } from '../obstacles/barrier.js';
import { createGround } from '../ground.js';
import { createCup } from '../cup.js';
import { createFlag } from '../flag.js';
import { createWindmillBase, createWindmillBlades } from '../obstacles/windmill.js';

import { createOutOfBoundsPlane } from '../debug/outOfBoundsPlane.js';

import { createSceneryGround } from '../scenery/sceneryGround.js';
import { createTrees } from '../scenery/trees.js';

import * as THREE from '../../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';

function createHole5(physMaterials) {

    const clearingPosition = new THREE.Vector3(0.0, 0.0, 0.0);
    const clearingRadius = 10.0;
    const groundHeight = -0.33;

    const light = createLight(new THREE.Vector3(3, 5, 2));
    const sceneryGround = createSceneryGround(new THREE.Vector3(0.0, groundHeight, 0.0));
    const trees = createTrees(clearingPosition, clearingRadius, groundHeight);

    const cup = createCup(new THREE.Vector3(0.0, 0.0, -6.0));
    const flag = createFlag(cup.position);
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

    const cupGroundSection = createGround(
            3,
            3,
            new THREE.Vector3(0.0, 0.0, -6.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            ),
            cup,
        );

    const groundSections = [
        cupGroundSection,
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
        windmillBase,
        windmillBlades,
        outOfBoundsPlane,
    ];

    hole.tick = (delta) => {
        windmillBlades.tick(delta);
    }

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

export { createHole5 };
