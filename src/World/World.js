import { createCamera } from './components/camera.js';
import { createBall } from './components/ball.js';
import { createPointer } from './components/pointer.js';
import { createCourse } from './components/course.js';
import { createScene } from './components/scene.js';
import { createLights } from './components/lights.js';
import { createPhysWorld } from './components/physWorld.js';
import { createStrikePower } from './components/strikePower.js';

import { createInGameMenu } from './ui/inGameMenu.js';

import { createDebugScreen } from './systems/debugScreen.js';
import { createControls } from './systems/controls.js';
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';

import * as THREE from '../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';
import { CSG } from '../../vendor/three-csg/three-csg.js';

function createWorld(container) {
    const loadCourse = (courseNum) => {
        const course = createCourse(courseNum);
        ball.mesh.position.copy(course.ballSpawnpoint);
        ball.body.position.copy(course.ballSpawnpoint);
        ball.body.velocity = new CANNON.Vec3(0, 0, 0);
        ball.body.angularVelocity = new CANNON.Vec3(0, 0, 0);
        camera.position.copy(course.cameraSpawnpoint);

        scene.clear();
        physWorld.bodies = [];

        //add game objects to the world
        scene.add(ball.mesh); 
        scene.add(pointer.mesh);
        scene.add(light);
        physWorld.addBody(ball.body);
        for (let o of course.objects) {
            if(o.mesh != null) { scene.add(o.mesh); }
            if(o.body != null) { physWorld.addBody(o.body); }
        }

        //event listeners

        const holeCollideResponse = (event) => {
            if (event.body === ball.body) {
                course.holeGroundSection.body.collisionFilterGroup = 2;
                ball.body.collisionFilterMask = 1;
                console.log('trigger activated', event);
            }
        };

        const holeCollideEndResponse = (event) => {
            if (
                (event.bodyA === ball.body && event.bodyB === course.hole.trigger.body) ||
                (event.bodyA === course.hole.trigger.body && event.bodyB === ball.body)
            ) {
                course.holeGroundSection.body.collisionFilterGroup = 1;
                ball.body.collisionFilterMask = -1;
                console.log('trigger disactivated', event);
            }

        };

        course.hole.trigger.body.removeEventListener('collide', holeCollideResponse);
        course.hole.trigger.body.addEventListener('collide', holeCollideResponse);

        physWorld.removeEventListener('endContact', holeCollideEndResponse);
        physWorld.addEventListener('endContact', holeCollideEndResponse);

        return course;
    }

    const processKeyEvent = (event) => {
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
        //M Key
        if (keyCode == 77) { inGameMenu.toggle(); }
        //1 key
        if (keyCode == 49) { course = loadCourse(1); }
        //2 key
        if (keyCode == 50) { course = loadCourse(2); }

    }

    const addDebugEntries = () => {
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
        //debugScreen.addEntry("Cam pos: ", () => {
        //    return camera.position.x.toFixed(2) + "," +
        //        camera.position.y.toFixed(2) + ", " +
        //        camera.position.z.toFixed(2);
        //});
        //debugScreen.addEntry("Cam dir: ", () => {
        //    const camDirection = new THREE.Vector3();
        //    camera.getWorldDirection(camDirection);
        //    return camDirection.x.toFixed(2) + "," +
        //        camDirection.y.toFixed(2) + ", " +
        //        camDirection.z.toFixed(2);
        //});
        debugScreen.addEntry("Ball pos: ", () => {
            return ball.mesh.position.x.toFixed(2) + ", " +  
                ball.mesh.position.y.toFixed(2) + ", " +  
                ball.mesh.position.z.toFixed(2);
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

    const world = {};

    const renderer = createRenderer();
    container.append(renderer.domElement);
    const camera = createCamera();
    const resizer = new Resizer(container, camera, renderer);
    const scene = createScene();
    const loop = new Loop(camera, scene, renderer);
    const physWorld = createPhysWorld();
    physWorld.solver.iterations = 50;
    const controls = createControls(camera, renderer.domElement);
    const light = createLights();
    const debugScreen = createDebugScreen();

    const MIN_STRIKE_POWER = 1;
    const MAX_STRIKE_POWER = 60;
    const strikePower = createStrikePower(MIN_STRIKE_POWER, MAX_STRIKE_POWER);

    const ball = createBall();
    const pointer = createPointer(camera,strikePower);

    //camera target
    controls.targetObj = ball.body;
    camera.targetObj = ball.body;

    let course = loadCourse(2);

    const inGameMenu = createInGameMenu();
    inGameMenu.restartButton.onclick = () => {
        console.log(course.number);
        course = loadCourse(course.number); 
        inGameMenu.setState("closed");
    };

    //adding updatable objects to updating loop
    loop.updatables.push(physWorld);
    loop.updatables.push(ball);
    loop.updatables.push(camera);
    loop.updatables.push(controls);
    loop.updatables.push(pointer);
    loop.updatables.push(debugScreen);

    addDebugEntries();

    //key press event listner
    document.addEventListener("keydown", (event) => {
        processKeyEvent(event);
    }, false);

    world.render = () => {
        renderer.render(scene, camera);
    }

    world.start = () => {
        loop.start();
    }

    world.stop = () => {
        loop.stop();
    }

    return world;
}

export { createWorld };
