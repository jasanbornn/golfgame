import { createCamera } from './components/camera.js';
import { createCube } from './components/cube.js';
import { createSphere } from './components/sphere.js';
import { createHole } from './components/hole.js';
import { createHoleTrigger } from './components/holeTrigger.js';
import { createPlane } from './components/plane.js';
import { createPlaneClip } from './components/planeClip.js';
import { createScene } from './components/scene.js';
import { createLights } from './components/lights.js';
import { createPhysWorld } from './components/physWorld.js';

import { createControls } from './systems/controls.js';
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';

import { CSG } from '../../vendor/three-csg/three-csg.js';


import { 
    CylinderGeometry,
    SphereGeometry,
    Mesh,
    MeshStandardMaterial,
    Vector3
} from 'https://cdn.skypack.dev/three@0.132.2';
import { Body, ContactMaterial, Material, Sphere, Vec3 } from 'https://cdn.skypack.dev/cannon-es@0.20.0';

let camera;
let renderer;
let scene;
let loop;
let physWorld;

class World {
    constructor(container) {
        camera = createCamera();
        scene = createScene();
        renderer = createRenderer();
        loop = new Loop(camera, scene, renderer);
        physWorld = createPhysWorld();
        container.append(renderer.domElement);

        const resizer = new Resizer(container, camera, renderer);

        const controls = createControls(camera, renderer.domElement);
        const sphere = createSphere();
        const plane = createPlane();
        const hole = createHole(16);
        const light = createLights();
        const planeClip = createPlaneClip(plane,hole);
        const holeTrigger = createHoleTrigger(hole);

        holeTrigger.body.addEventListener('collide', (event) => {
            if (event.body === sphere.body) {
                plane.body.collisionFilterGroup = 2;
                sphere.body.collisionFilterMask = 1;
                console.log('trigger activated', event);
            }
        });

        physWorld.addEventListener('endContact', (event) => {
            if (
                (event.bodyA === sphere.body && event.bodyB === holeTrigger.body) ||
                (event.bodyA === holeTrigger.body && event.bodyB === sphere.body)
            ) {
                plane.body.collisionFilterGroup = 1;
                sphere.body.collisionFilterMask = -1;
                console.log('trigger disactivated', event);
            }
        });

        const groundPhysMaterial = new Material('ground');
        plane.body.material = groundPhysMaterial;
        const ballPhysMaterial = new Material('ball');
        sphere.body.material = ballPhysMaterial;
        const ballToGroundContactMaterial = new ContactMaterial(
            groundPhysMaterial,
            ballPhysMaterial,
            {
                friction: 1.0,
                restitution: 0.3,
            },
        );
        physWorld.addContactMaterial(ballToGroundContactMaterial);

        controls.targetObj = sphere.mesh;
        camera.targetObj = sphere.body;

        physWorld.addBody(sphere.body);
        physWorld.addBody(plane.body);
        physWorld.addBody(hole.body);
        physWorld.addBody(holeTrigger.body);

        loop.updatables.push(physWorld);
        loop.updatables.push(sphere);
        loop.updatables.push(camera);
        loop.updatables.push(controls);

        scene.add(hole.mesh, sphere.mesh, planeClip.mesh, light);

        document.addEventListener("keydown", (event) => {
            let keyCode = event.which;
            //if up arrow pressed
            if (keyCode == 38) {
                let cameraDirection = new Vector3(0, 0, 0);
                camera.getWorldDirection(cameraDirection);
                sphere.strike(cameraDirection);
            }

            // if down arrow pressed
            if (keyCode == 40) {
                sphere.body.velocity = new Vec3(0, 0, 0);
            }
        }, false);
    }

    render() {
        //draw a single frame
        renderer.render(scene, camera);
    }

    start() {
        loop.start();
    }

    stop() {
        loop.stop();
    }
}

export { World };
