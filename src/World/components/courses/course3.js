import { createBarrier } from '../obstacles/barrier.js';
import { createGround } from '../ground.js';
import { createHole } from '../hole.js';
import { createFlag } from '../flag.js';

import * as THREE from '../../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';

function createCourse3(physMaterials) {

    const hole = createHole(new THREE.Vector3(-5.9, -0.975 - 0.975, 5.9));
    const flag = createFlag(new THREE.Vector3(-5.9, -0.975 - 0.975, 5.9));
    const holeGroundSection = createGround(
            1,
            1,
            new THREE.Vector3(-5.9, -0.975 - 0.975, 5.9),
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
            )
        ),
        createGround(
            1,
            5,
            new THREE.Vector3(0.0, -0.488, 2.95),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(1.0, 0.0, 0.0),
                Math.PI / 16,
            )
        ),
        createGround(
            1,
            1,
            new THREE.Vector3(0.0, -0.975, 5.9),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            )
        ),
        createGround(
            1,
            5,
            new THREE.Vector3(-2.95, -0.975 - 0.488, 5.9),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                -Math.PI / 2,
            ).multiply(
                new THREE.Quaternion().setFromAxisAngle(
                    new THREE.Vector3(1.0, 0.0, 0.0),
                    Math.PI / 16,
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
            5,
            new THREE.Vector3(0.5, -0.488, 2.95),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                -Math.PI / 2,
            ).multiply(
                new THREE.Quaternion().setFromAxisAngle(
                    new THREE.Vector3(0.0, 0.0, 1.0),
                    -Math.PI / 16,
                )
            ),
        ),
        createBarrier(
            1,
            new THREE.Vector3(0.5, -0.975, 5.9),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                -Math.PI / 2,
            ),
        ),
        createBarrier(
            1,
            new THREE.Vector3(0.0, -0.975, 6.4),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI,
            ),
        ),
        createBarrier(
            5,
            new THREE.Vector3(-2.95, -0.975 - 0.488, 6.4),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI,
            ).multiply(
                new THREE.Quaternion().setFromAxisAngle(
                    new THREE.Vector3(0.0, 0.0, 1.0),
                    -Math.PI / 16,
                )
            ),
        ),
        createBarrier(
            1,
            new THREE.Vector3(-5.9, -0.975 - 0.975, 6.4),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI,
            ),
        ),
        createBarrier(
            1,
            new THREE.Vector3(-6.4, -0.975 - 0.975, 5.9),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI / 2,
            ),
        ),
        createBarrier(
            1,
            new THREE.Vector3(-5.9, -0.975 - 0.975, 5.4),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            ),
        ),
        createBarrier(
            5,
            new THREE.Vector3(-2.95, -0.975 - 0.488, 5.4),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                0,
            ).multiply(
                new THREE.Quaternion().setFromAxisAngle(
                    new THREE.Vector3(0.0, 0.0, 1.0),
                    Math.PI / 16,
                )
            ),
        ),
        createBarrier(
            5,
            new THREE.Vector3(-0.5, -0.488, 2.95),
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.0, 1.0, 0.0),
                Math.PI / 2,
            ).multiply(
                new THREE.Quaternion().setFromAxisAngle(
                    new THREE.Vector3(0.0, 0.0, 1.0),
                    Math.PI / 16,
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
    }

    course.objects = [
        course.hole,
        course.hole.collideTrigger,
        course.hole.inTrigger,
        flag,
    ];

    for(let groundSection of groundSections) {
        course.objects.push(groundSection);
    }

    for(let barrier of barriers) {
        course.objects.push(barrier); 
    }

    return course;

}

export { createCourse3 };
