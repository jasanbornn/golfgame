import { createCamera } from './components/camera.js';
import { createSphere } from './components/sphere.js';
import { createPointer } from './components/pointer.js';
import { createHole } from './components/hole.js';
import { createHoleTrigger } from './components/holeTrigger.js';
import { createPlane } from './components/plane.js';
import { createPlaneClip } from './components/planeClip.js';
import { createScene } from './components/scene.js';
import { createLights } from './components/lights.js';
import { createPhysWorld } from './components/physWorld.js';
import { createStrikePower } from './components/strikePower.js';

import { createDebugScreen } from './systems/debugScreen.js';
import { createControls } from './systems/controls.js';
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';

import * as THREE from '../../vendor/three/build/three.module.js';
import { Body, ContactMaterial, Material, Sphere, Vec3 } from 'https://cdn.skypack.dev/cannon-es@0.20.0';
import { CSG } from '../../vendor/three-csg/three-csg.js';

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

        const MIN_STRIKE_POWER = 1;
        const MAX_STRIKE_POWER = 100;

        const strikePower = createStrikePower(MIN_STRIKE_POWER, MAX_STRIKE_POWER);

        //const strikeIterations = 32;
        //const STRIKE_POWER_INTERVAL = 
        //    (MAX_STRIKE_POWER - MIN_STRIKE_POWER) / strikeIterations;
        //let strikePower = (MAX_STRIKE_POWER + MIN_STRIKE_POWER) / 2;
        //let strikePercent = (() => {
        //    return strikePower / (MAX_STRIKE_POWER - MIN_STRIKE_POWER);
        //})();

        const debugScreen = createDebugScreen();
        const controls = createControls(camera, renderer.domElement);
        const sphere = createSphere();
        const pointer = createPointer(camera,strikePower);
        const plane = createPlane();
        const hole = createHole(32);
        const light = createLights();
        const planeClip = createPlaneClip(plane,hole);
        const holeTrigger = createHoleTrigger(hole);


        //hole-ball collision event listeners
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

        //camera target
        controls.targetObj = sphere.mesh;
        camera.targetObj = sphere.body;

        //adding phys bodys to cannon-js phys world
        physWorld.addBody(sphere.body);
        physWorld.addBody(plane.body);
        physWorld.addBody(hole.body);
        physWorld.addBody(holeTrigger.body);

        //adding updatable objects to updating loop
        loop.updatables.push(physWorld);
        loop.updatables.push(sphere);
        loop.updatables.push(camera);
        loop.updatables.push(controls);
        loop.updatables.push(debugScreen);
        loop.updatables.push(pointer);

        //add meshes to threejs world
        scene.add(hole.mesh, sphere.mesh, planeClip.mesh, pointer.mesh, light);

        //debug screen entries
        debugScreen.addEntry("Ball speed: ", () => {
            return sphere.body.velocity.length().toFixed(2);
        });
        debugScreen.addEntry("Power: ", () => {
            return strikePower.getValue().toFixed(2);
        });
        debugScreen.addEntry("Power %: ", () => {
            return strikePower.percentPower().toFixed(2);
        });
        //debugScreen.addEntry("Cam qtrn: ", () => {
        //    return camera.quaternion.x.toFixed(2) + "," +
        //        camera.quaternion.y.toFixed(2) + ", " +
        //        camera.quaternion.z.toFixed(2) + ", " +
        //        camera.quaternion.w.toFixed(2) + ", ";
        //});
        debugScreen.addEntry("Cam pos: ", () => {
            return camera.position.x.toFixed(2) + "," +
                camera.position.y.toFixed(2) + ", " +
                camera.position.z.toFixed(2);
        });
        debugScreen.addEntry("Cam dir: ", () => {
            const camDirection = new THREE.Vector3();
            camera.getWorldDirection(camDirection);
            return camDirection.x.toFixed(2) + "," +
                camDirection.y.toFixed(2) + ", " +
                camDirection.z.toFixed(2);
        });
        debugScreen.addEntry("Ball vel: ", () => {
            return sphere.body.velocity.x.toFixed(2) + ", " +
                sphere.body.velocity.y.toFixed(2) + ", " +
                sphere.body.velocity.z.toFixed(2);
        });

        //debugScreen.addEntry("Ptr qtrn: ", () => {
        //    return pointer.mesh.quaternion.x.toFixed(2) + "," +
        //        pointer.mesh.quaternion.y.toFixed(2) + "," +
        //        pointer.mesh.quaternion.z.toFixed(2) + ", " +
        //        pointer.mesh.quaternion.w.toFixed(2);
        //});
        //debugScreen.addEntry("Ptr dir: ", () => {
        //    let pointerDirection = new THREE.Vector3();
        //    pointer.mesh.getWorldDirection(pointerDirection);
        //    return pointerDirection.x.toFixed(2) + "," +
        //        pointerDirection.y.toFixed(2) + ", " +
        //        pointerDirection.z.toFixed(2);
        //});

        //key press event listner
        document.addEventListener("keydown", (event) => {
            let keyCode = event.which;
            //if up arrow pressed
            if (keyCode == 38) {
                if (sphere.body.velocity.length() < 0.01) {
                    let cameraDirection = new THREE.Vector3(0, 0, 0);
                    camera.getWorldDirection(cameraDirection);
                    sphere.strike(cameraDirection, strikePower.getValue());
                }
            }

            // if down arrow pressed
            if (keyCode == 40) {
                sphere.body.velocity = new Vec3(0, 0, 0);
            }

            //I key
            if (keyCode == 73) {
                debugScreen.toggleVisibility();
            }

            //G Key
            if (keyCode == 71) {
                //jank
                pointer.mesh.applyQuaternion(new THREE.Quaternion(0.0, 0.5, 0.0, 0.7).normalize());
            }
            //W key
            if (keyCode == 87) {
                strikePower.increasePower();

                //strikePower += STRIKE_POWER_INTERVAL;
                //if (strikePower > MAX_STRIKE_POWER) {
                //    strikePower = MAX_STRIKE_POWER;
                //}
            }

            //S key
            if (keyCode == 83) {
                strikePower.decreasePower();

                //strikePower -= STRIKE_POWER_INTERVAL;
                //if (strikePower < MIN_STRIKE_POWER) {
                //    strikePower = MIN_STRIKE_POWER;
                //}
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
