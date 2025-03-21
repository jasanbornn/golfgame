import { createLight } from '../light.js';
import { createBarrier } from '../obstacles/barrier.js';
import { createGround } from '../ground.js';
import { createHole } from '../hole.js';
import { createFlag } from '../flag.js';

import { createOutOfBoundsPlane } from '../debug/outOfBoundsPlane.js';

import { createSceneryGround } from '../scenery/sceneryGround.js';

import * as THREE from '../../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';

function createCourse3(physMaterials) {

    const light = createLight(new THREE.Vector3(-10, 5, -2));
    const sceneryGround = createSceneryGround(new THREE.Vector3(0.0, -2.5, 0.0));

    const hole = createHole(new THREE.Vector3(-6.0, -2.0, 6.0));
    const flag = createFlag(hole.position);
    const ballSpawnpoint = new THREE.Vector3(0.0, 0.1, 0.0);
    const cameraSpawnpoint = new THREE.Vector3(0.0, 1.0, -2.0);
    const outOfBoundsYLevel = -2.3;
    const outOfBoundsPlane = createOutOfBoundsPlane(outOfBoundsYLevel);

    const holeGroundSection = createGround(
            1,
            1,
            new THREE.Vector3(-6.0, -2.0, 6.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            ),
            hole,
        );

    const groundSections = [
        //final landing
        holeGroundSection,
        //starting landing
        createGround(
            1.0,
            1.0,
            new THREE.Vector3(0.0, 0.0, 0.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            )
        ),
        //first slope
        createGround(
            1,
            5.10,
            new THREE.Vector3(0.0, -0.5, 3.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(1.0, 0.0, 0.0),
                0.1974,
            )
        ),
        //middle landing
        createGround(
            1,
            1,
            new THREE.Vector3(0.0, -1.0, 6.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            )
        ),
        //second slope
        createGround(
            1,
            5.10,
            new THREE.Vector3(-3.0, -1.5, 6.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                -Math.PI / 2,
            ).multiply(
                new THREE.Quaternion().setFromAxisAngle(
                    new THREE.Vector3(1.0, 0.0, 0.0),
                    0.1974,
                )
            ),
        ),
    ];

    const barriers = [
        createBarrier(
            1,
            new THREE.Vector3(0.0, 0.0, -0.5),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            ),
        ),
        createBarrier(
            1,
            new THREE.Vector3(0.5, 0.0, 0.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                -Math.PI / 2,
            ),
        ),
        createBarrier(
            5.10,
            new THREE.Vector3(0.5, -0.5, 3.00),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                -Math.PI / 2,
            ).multiply(
                new THREE.Quaternion().setFromAxisAngle(
                    new THREE.Vector3(0.0, 0.0, 1.0),
                    -0.1974,
                )
            ),
        ),
        createBarrier(
            1,
            new THREE.Vector3(0.5, -1.0, 6.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                -Math.PI / 2,
            ),
        ),
        createBarrier(
            1,
            new THREE.Vector3(0.0, -1.0, 6.5),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI,
            ),
        ),
        createBarrier(
            5.10,
            new THREE.Vector3(-3.0, -1.5, 6.5),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI,
            ).multiply(
                new THREE.Quaternion().setFromAxisAngle(
                    new THREE.Vector3(0.0, 0.0, 1.0),
                    -0.1974,
                )
            ),
        ),
        createBarrier(
            1,
            new THREE.Vector3(-6.0, -2.0, 6.5),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI,
            ),
        ),
        createBarrier(
            1,
            new THREE.Vector3(-6.5, -2.0, 6.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI / 2,
            ),
        ),
        createBarrier(
            1,
            new THREE.Vector3(-6.0, -2.0, 5.5),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            ),
        ),
        createBarrier(
            5.10,
            new THREE.Vector3(-3.0, -1.5, 5.5),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            ).multiply(
                new THREE.Quaternion().setFromAxisAngle(
                    new THREE.Vector3(0.0, 0.0, 1.0),
                    0.1974,
                )
            ),
        ),
        createBarrier(
            5.10,
            new THREE.Vector3(-0.5, -0.5, 3.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI / 2,
            ).multiply(
                new THREE.Quaternion().setFromAxisAngle(
                    new THREE.Vector3(0.0, 0.0, 1.0),
                    0.1974,
                )
            ),
        ),
        createBarrier(
            1,
            new THREE.Vector3(-0.5, 0.0, 0.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI / 2,
            ),
        ),
    ];

    const course = {
        ballSpawnpoint: new THREE.Vector3(0.0, 0.1, 0.0),
        cameraSpawnpoint: new THREE.Vector3(0.0, 1.0, -2.0),
        hole: hole,
        par: 3,
        holeGroundSection: holeGroundSection,
        groundSections: groundSections,
        barriers: barriers,
        outOfBoundsYLevel: outOfBoundsYLevel,
    };

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

export { createCourse3 };
