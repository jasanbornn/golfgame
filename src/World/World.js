import { createCamera } from './components/camera.js';
import { createBall } from './components/ball.js';
import { createPointer } from './components/pointer.js';
import { createCourse } from './components/course.js';
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
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';
import { CSG } from '../../vendor/three-csg/three-csg.js';

let camera;
let renderer;
let scene;
let loop;
let physWorld;

class World {
    constructor(container) {
        renderer = createRenderer();
        container.append(renderer.domElement);
        camera = createCamera();
        const resizer = new Resizer(container, camera, renderer);
        scene = createScene();
        loop = new Loop(camera, scene, renderer);
        physWorld = createPhysWorld();
        physWorld.solver.iterations = 50;
        const controls = createControls(camera, renderer.domElement);
        const light = createLights();

        const debugScreen = createDebugScreen();

        const MIN_STRIKE_POWER = 1;
        const MAX_STRIKE_POWER = 60;
        const strikePower = createStrikePower(MIN_STRIKE_POWER, MAX_STRIKE_POWER);

        const course = createCourse(2, 10);
        const pointer = createPointer(camera,strikePower);
        const ball = createBall();
        ball.body.position.copy(course.ballSpawnpoint);
        ball.mesh.position.copy(ball.body.position);

        //camera target
        controls.targetObj = ball.mesh;
        camera.targetObj = ball.body;

        //hole-ball collision event listeners
        course.holeTrigger.body.addEventListener('collide', (event) => {
            if (event.body === ball.body) {
                course.ground.body.collisionFilterGroup = 2;
                ball.body.collisionFilterMask = 1;
                console.log('trigger activated', event);
            }
        });
        physWorld.addEventListener('endContact', (event) => {
            if (
                (event.bodyA === ball.body && event.bodyB === course.holeTrigger.body) ||
                (event.bodyA === course.holeTrigger.body && event.bodyB === ball.body)
            ) {
                course.ground.body.collisionFilterGroup = 1;
                ball.body.collisionFilterMask = -1;
                console.log('trigger disactivated', event);
            }
        });

        //contact materials
        const groundMaterial = course.ground.body.material;
        const barrierMaterial = course.barriers[0].body.material;
        const ballMaterial = ball.body.material;

        const ballGroundContact = new CANNON.ContactMaterial(ballMaterial, groundMaterial, {friction: 0.4, restitution: 0.2});
        const ballBarrierContact = new CANNON.ContactMaterial(ballMaterial, barrierMaterial, {friction: 0.8, restitution: 0.9});
        
        physWorld.addContactMaterial(ballGroundContact);
        physWorld.addContactMaterial(ballBarrierContact);

        //adding phys bodys to cannon-js phys world
        physWorld.addBody(ball.body);
        for (let o of course.physObjects) {
            physWorld.addBody(o);
        }
        //add meshes to threejs world
        scene.add(
            ball.mesh, 
            pointer.mesh, 
            light
        );
        for (let m of course.models) {
            scene.add(m);
        }

        //adding updatable objects to updating loop
        loop.updatables.push(physWorld);
        loop.updatables.push(ball);
        loop.updatables.push(camera);
        loop.updatables.push(controls);
        loop.updatables.push(debugScreen);
        loop.updatables.push(pointer);

        addDebugEntries(debugScreen, ball, strikePower, pointer);

        //key press event listner
        document.addEventListener("keydown", (event) => {
            processKeyEvent(event, ball, debugScreen, strikePower);
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

function processKeyEvent(event, ball, debugScreen, strikePower) {
    let keyCode = event.which;

    //Up Arrow
    if (keyCode == 38) {
        if (ball.body.velocity.length() < 0.01) {
            let cameraDirection = new THREE.Vector3(0, 0, 0);
            camera.getWorldDirection(cameraDirection);
            ball.strike(cameraDirection, strikePower.getValue());
        }
    }

    //Down Arrow
    if (keyCode == 40) { ball.body.velocity = new CANNON.Vec3(0, 0, 0); }
    //I key
    if (keyCode == 73) { debugScreen.toggleVisibility(); }
    //W key
    if (keyCode == 87) { strikePower.increasePower(); }
    //S key
    if (keyCode == 83) { strikePower.decreasePower(); }

}

function addDebugEntries(debugScreen, ball, strikePower, pointer) {
    //debug screen entries
    debugScreen.addEntry("Ball speed: ", () => {
        return ball.body.velocity.length().toFixed(2);
    });
    debugScreen.addEntry("Power: ", () => {
        return strikePower.getValue().toFixed(2);
    });
    debugScreen.addEntry("Power %: ", () => {
        return strikePower.percentPower().toFixed(2);
    });
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
        return ball.body.velocity.x.toFixed(2) + ", " +
            ball.body.velocity.y.toFixed(2) + ", " +
            ball.body.velocity.z.toFixed(2);
    });
    debugScreen.addEntry("Ptr quatern: ", () => {
        return pointer.mesh.quaternion.x.toFixed(2) + ", " +  
            pointer.mesh.quaternion.y.toFixed(2) + ", " +  
            pointer.mesh.quaternion.z.toFixed(2) + ", " +  
            pointer.mesh.quaternion.w.toFixed(2);
    });

}

export { World };
