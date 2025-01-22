import { createBarrier } from '../obstacles/barrier.js';
import { createWedge } from '../obstacles/wedge.js';
import { createGround } from '../ground.js';
import { createHole } from '../hole.js';
import { createFlag } from '../flag.js';

import { createSceneryGround } from '../scenery/sceneryGround.js';

import * as THREE from '../../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';

function createCourse5(physMaterials) {

    const sceneryGround = createSceneryGround(new THREE.Vector3(0.0, -0.2, 0.0));
    const hole = createHole(new THREE.Vector3(0.0, 0.0, -7.0));
    const flag = createFlag(hole.position);
    const ballSpawnpoint = new THREE.Vector3(0.0, 0.1, 0.3);
    const cameraSpawnpoint = new THREE.Vector3(0.0, 1.5, 3.0);

    const wedge = createWedge(
        0.3,
        0.3,
        new THREE.Vector3(0.0, 1.0, -0.72),
        new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0.0, 1.0, 0.0),
            -Math.PI / 4,
        ),
    );

    const holeGroundSection = createGround(
            1,
            1,
            new THREE.Vector3(0.0, 0.0, -7.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            ),
            hole,
        );

    const groundSections = [
        holeGroundSection,
        createGround(
            1,
            1,
            new THREE.Vector3(0.0, 0.0, 0.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            ),
        ),
        createGround(
            1,
            1,
            new THREE.Vector3(0.0, 1.0, -1.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            )
        ),
        createGround(
            1,
            2,
            new THREE.Vector3(3.0, 0.5, -0.5),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            )
        ),
        createGround(
            1,
            2,
            new THREE.Vector3(-3.0, 0.5, -0.5),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            )
        ),
        createGround(
            1,
            2.06,
            new THREE.Vector3(1.5, 0.25, 0.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                -Math.PI / 2,
            ).multiply(
                new THREE.Quaternion().setFromAxisAngle(
                    new THREE.Vector3(1.0, 0.0, 0.0),
                    0.244,
                )
            ),
        ),
        createGround(
            1,
            2.06,
            new THREE.Vector3(1.5, 0.75, -1.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI / 2,
            ).multiply(
                new THREE.Quaternion().setFromAxisAngle(
                    new THREE.Vector3(1.0, 0.0, 0.0),
                    0.244,
                )
            ),
        ),
        createGround(
            1,
            2.06,
            new THREE.Vector3(-1.5, 0.25, 0.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI / 2,
            ).multiply(
                new THREE.Quaternion().setFromAxisAngle(
                    new THREE.Vector3(1.0, 0.0, 0.0),
                    0.244,
                )
            ),
        ),
        createGround(
            1,
            2.06,
            new THREE.Vector3(-1.5, 0.75, -1.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                -Math.PI / 2,
            ).multiply(
                new THREE.Quaternion().setFromAxisAngle(
                    new THREE.Vector3(1.0, 0.0, 0.0),
                    0.244,
                )
            ),
        ),
        createGround(
            1,
            5.099,
            new THREE.Vector3(0.0, 0.50, -4.0),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI,
            ).multiply(
                new THREE.Quaternion().setFromAxisAngle(
                    new THREE.Vector3(1.0, 0.0, 0.0),
                    0.197,
                ),
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
            1,
            new THREE.Vector3(0.0, 1.0, -0.5),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI,
            ),
        ),
        createBarrier(
            0.2,
            new THREE.Vector3(-0.5, 1.0, -0.6),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI / 2,
            ),
        ),
        createBarrier(
            0.2,
            new THREE.Vector3(0.5, 1.0, -0.6),
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
        par: 4,
        holeGroundSection: holeGroundSection,
        groundSections: groundSections,
        barriers: barriers,
    }

    course.objects = [
        course.hole,
        course.hole.collideTrigger,
        course.hole.inTrigger,
        flag,
        sceneryGround,
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

export { createCourse5 };
