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

function createHole8(physMaterials) {

    const clearingPosition = new THREE.Vector3(0.0, 0.0, -7.0);
    const clearingRadius = 10.0;
    const groundHeight = -0.33;

    const light = createLight(new THREE.Vector3(0, 3, 10));
    const sceneryGround = createSceneryGround(new THREE.Vector3(0.0, groundHeight, 0.0));
    const trees = createTrees(clearingPosition, clearingRadius, groundHeight);

    const cup = createCup(new THREE.Vector3(-9.0, 0.5, -9.0));
    const flag = createFlag(cup.position);
    const ballSpawnpoint = new THREE.Vector3(0.0, 2.1, 0.0);
    const cameraSpawnpoint = new THREE.Vector3(0.0, 4.0, 3.0);
    const outOfBoundsYLevel = 0.0;
    const outOfBoundsPlane = createOutOfBoundsPlane(outOfBoundsYLevel);

    const cupGroundSection = createGround(
            1,
            1,
            new THREE.Vector3(-9.0, 0.5, -9.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            ),
            cup,
        );

    const groundSections = [
        cupGroundSection,
        //start landing
        createGround(
            1,
            2,
            new THREE.Vector3(0.0, 2.0, -0.5),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            )
        ),
        //rightward ramp
        createGround(
            10,
            3.16,
            new THREE.Vector3(2.0, 2.5, -4.5),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                -Math.PI / 2,
            ).multiply(new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(1.0, 0.0, 0.0),
                0.322,
            )),
        ),
        //lower ramp
        createGround(
            3,
            3.04,
            new THREE.Vector3(-1.0, 1.75, -9.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                -Math.PI / 2,
            ).multiply(new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(1.0, 0.0, 0.0),
                0.165,
            )),
        ),
        //safety landing section 1
        createGround(
            1,
            6.0,
            new THREE.Vector3(0.0, 0.5, -4.5),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            )
        ),
        //safety landing section 2
        createGround(
            1,
            3.0,
            new THREE.Vector3(-2.0, 0.5, -7.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                -Math.PI / 2,
            )
        ),
        //safety landing section 3
        createGround(
            2.0,
            3.0,
            new THREE.Vector3(-3.5, 0.5, -9.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            )
        ),
        //final bridge
        createGround(
            1.0,
            4.0,
            new THREE.Vector3(-6.5, 0.5, -9.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                -Math.PI / 2,
            )
        ),
    ];

    const barriers = [
        //right ramp back barrier
        createBarrier(
            3.16,
            new THREE.Vector3(2.0, 2.5, -9.5),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 0.0, 1.0),
                0.322,
            )
        ),
        //saftey landing section 1
        createBarrier(
            5.0,
            new THREE.Vector3(-0.5, 0.5, -4.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI / 2,
            )
        ),

        //saftey landing section 2 pt 1
        createBarrier(
            3.0,
            new THREE.Vector3(-2.0, 0.5, -6.5),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI,
            )
        ),
        //saftey landing section 2 pt 2
        createBarrier(
            1.0,
            new THREE.Vector3(-3.5, 0.5, -7.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI / 2,
            )
        ),
        //saftey landing section 3 pt 1
        createBarrier(
            1.0,
            new THREE.Vector3(-4.0, 0.5, -7.5),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            )
        ),
        //saftey landing section 3 pt 2
        createBarrier(
            1.0,
            new THREE.Vector3(-4.5, 0.5, -8.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI / 2,
            )
        ),
        //lower ramp back guide
        createBarrier(
            3.0,
            new THREE.Vector3(-1.0, 1.75, -10.05),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 0.0, 1.0),
                0.165,
            ).multiply(new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI / 16,
            )),
        ),
        //lower ramp front guide
        createBarrier(
            2.2,
            new THREE.Vector3(-0.5, 1.8, -8.75),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 0.0, 1.0),
                0.165,
            ).multiply(new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                -6 * Math.PI / 16,
            )),
        ),
        //flag barrier 1
        createBarrier(
            2.0,
            new THREE.Vector3(-8.5, 0.5, -9.5),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI,
            )
        ),
        //flag barrier 2
        createBarrier(
            1.0,
            new THREE.Vector3(-9.5, 0.5, -9.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI / 2,
            )
        ),
        //flag barrier 3
        createBarrier(
            2.0,
            new THREE.Vector3(-8.5, 0.5, -8.5),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            )
        ),
    ];

    const hole = {
        ballSpawnpoint: ballSpawnpoint,
        cameraSpawnpoint: cameraSpawnpoint,
        cup: cup,
        trees: trees,
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

    for(const tree of trees.treeObjects) {
        hole.objects.push(tree);
    }

    return hole;

}

export { createHole8 };
