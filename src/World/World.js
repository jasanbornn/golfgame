import { createCamera } from './components/camera.js';
import { createBall } from './components/ball.js';
import { createPointer } from './components/pointer.js';
import { createCourse } from './components/course.js';
import { createScene } from './components/scene.js';
import { createPhysWorld } from './components/physWorld.js';
import { createStrikePower } from './components/strikePower.js';

import { createInGameMenu } from './ui/inGameMenu.js';
import { createHud } from './ui/hud.js';
import { createScorecard } from './ui/scorecard.js';
import { createScoreCallout } from './ui/scoreCallout.js';
import { createLoadingScreen } from './ui/loadingScreen.js';
import { createContinueButton } from './ui/continueButton.js';

import { createDebugScreen } from './systems/debugScreen.js';
import { createControls } from './systems/controls.js';
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { createLoop } from './systems/Loop.js';
import { createAudioHelper } from './systems/audioHelper.js';

import * as THREE from '../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';
import { CSG } from '../../vendor/three-csg/three-csg.js';

function createWorld(container) {
    //event listeners
    const holeCollideResponse = (event) => {
        if (event.body === ball.body) {
            course.holeGroundSection.body.collisionFilterGroup = 2;
            ball.body.collisionFilterMask = 1;
        }
    };

    const holeCollideEndResponse = (event) => {
        if (
            (event.bodyA === ball.body && event.bodyB === course.hole.collideTrigger.body) ||
            (event.bodyA === course.hole.collideTrigger.body && event.bodyB === ball.body)
        ) {
            course.holeGroundSection.body.collisionFilterGroup = 1;
            ball.body.collisionFilterMask = -1;
        }

    };

    let holeFinished = false;
    const holeInResponse = (event) => {
        if(holeFinished || gameOver) {
            return;
        }
        holeFinished = true;

        if(event.body === ball.body) {
            audioHelper.playSound('assets/sound/ball_into_hole.wav');
            //audioHelper.playSound('assets/sound/clap.wav');
            scorecard.setScore(course.number, strokes);
            scoreCallout.displayScore(course.par, strokes);
            continueButton.prompt();
        }
    }

    const ballCollideResponse = (event) => {
        if(event.body.isTrigger) {
            return;
        }

        if(ball.velocityChange.length > 0.1) {
            //console.log("[world]" + ball.velocityChange.length());
        }

        const soundVolume = ball.velocityChange.length() / 10;

        if(event.body.material.restitution != undefined) {
            if(event.body.material.restitution > 0.5) {
               audioHelper.playSound('assets/sound/wood_thud.wav', soundVolume);
            } else {
               audioHelper.playSound('assets/sound/grass_thud.wav', soundVolume);
            }
        }
    }

    const pointerDownResponse = (event) => {
        audioHelper.resume();
        if(gameOver || inGameMenu.state != "closed") {
            return;
        }
        if(ball.body.velocity.length() >= 0.01) {
            return;
        }
        const pointerPos = getPointerPos(event);

        const raycaster = new THREE.Raycaster();

        raycaster.setFromCamera(pointerPos, camera);

        const intersects = raycaster.intersectObject(ball.touchSphere.mesh, false);
        if(intersects.length != 0) {
            if(intersects[0].object === ball.touchSphere.mesh) {
                pointerControlsStrikePower = true;
                controls.lockVertical(true);
                controls.invertHorizontal(true);
            }
        }
    }

    let activelyControlling = false;
    let startPointerPos;
    const pointerUpResponse = (event) => {
        if(pointerControlsStrikePower && strikePower.getValue() != 0) {
            strikeBall();
        }
        activelyControlling = false;
        pointerControlsStrikePower = false;
        controls.lockVertical(false);
        controls.invertHorizontal(false);
    }

    const pointerMoveResponse = (event) => {
        if(!pointerControlsStrikePower) {
            return;
        }

        if(activelyControlling) {
            let newStrikePower = (startPointerPos.y - getPointerPos(event).y) * 1.25;
            if(newStrikePower > 1.0) {
                newStrikePower = 1.0;
            }
            if(newStrikePower < 0.0) {
                newStrikePower = 0.0;
            }
            strikePower.setPercentPower(newStrikePower);
        } else {
            activelyControlling = true;
            startPointerPos = getPointerPos(event);
        }
    };

    const gameOverResponse = () => {
        gameOver = true;
        strikePower.setPercentPower(0);
    }

    const loadCourse = (courseNum) => {
        holeFinished = false;
        continueButton.hide();

        loadingScreen.show();

        const newCourse = createCourse(courseNum);
        ball.stop();
        ball.mesh.position.copy(newCourse.ballSpawnpoint);
        ball.body.position.copy(newCourse.ballSpawnpoint);
        camera.position.copy(newCourse.cameraSpawnpoint);
        camera.reset();

        scene.clear();
        physWorld.bodies = [];

        strokes = 0;
        par = newCourse.par;
        hud.setStrokesText(strokes);
        hud.setParText(par);


        //add game objects to the world
        scene.add(ball.mesh); 
        scene.add(ball.touchSphere.mesh);
        scene.add(pointer.mesh);

        //ambient light
        const ambientLight = new THREE.AmbientLight(0x809080, 1.0);
        scene.add(ambientLight);

        physWorld.addBody(ball.body);
        for (const o of newCourse.objects) {
            if(o.isLight) { scene.add(o); }
            if(o.mesh != null) { scene.add(o.mesh); }
            if(o.body != null) { physWorld.addBody(o.body); }
        }
        
        for (const sound of audioHelper.sounds) {
            scene.add(sound.audio);
        }

        newCourse.hole.collideTrigger.body.removeEventListener('collide', holeCollideResponse);
        newCourse.hole.collideTrigger.body.addEventListener('collide', holeCollideResponse);

        newCourse.hole.inTrigger.body.removeEventListener('collide', holeInResponse);
        newCourse.hole.inTrigger.body.addEventListener('collide', holeInResponse);

        ball.body.removeEventListener('collide', ballCollideResponse);
        ball.body.addEventListener('collide', ballCollideResponse);

        physWorld.removeEventListener('endContact', holeCollideEndResponse);
        physWorld.addEventListener('endContact', holeCollideEndResponse);

        window.addEventListener('mousedown', pointerDownResponse);
        window.addEventListener('mouseup', pointerUpResponse);
        window.addEventListener('mousemove', pointerMoveResponse);

        window.addEventListener('touchstart', pointerDownResponse);
        window.addEventListener('touchend', pointerUpResponse);
        window.addEventListener('touchmove', pointerMoveResponse);

        loop.targetCourse = newCourse;

        return newCourse;
    }

    const updateBallTouchSphere = (targetBall) => {
        const distance = controls.getDistance();
        const scale = Math.sqrt(distance / 3);
        targetBall.touchSphere.mesh.scale.setScalar(scale);
    }

    const getPointerPos = (event) => {
        //get pointer position on screen
        //see https://threejs.org/docs/#api/en/core/Raycaster
        const pointerPos = new THREE.Vector2();
        if(event.type == 'mousedown' || event.type == 'mouseup' || event.type == 'mousemove') {
            pointerPos.x = (event.clientX / window.innerWidth) * 2 - 1;
            pointerPos.y = -(event.clientY / window.innerHeight) * 2 + 1;
        }
        else if(event.type == 'touchstart' || event.type == 'touchend' || event.type == 'touchmove') {
            pointerPos.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
            pointerPos.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
        }
        return pointerPos;
    };

    const strikeBall = () => {
        if (ball.isSettled()) {
            if(strikePower.percentPower() < 0.3) {
                audioHelper.playSound('assets/sound/strike_low_power.wav')
                
            } else if (strikePower.percentPower() < 0.6) {
                audioHelper.playSound('assets/sound/strike_medium_power.wav')

            } else {
                audioHelper.playSound('assets/sound/strike_high_power.wav')
            }
            let cameraDirection = new THREE.Vector3(0, 0, 0);
            camera.getWorldDirection(cameraDirection);
            ball.strike(cameraDirection, strikePower.getValue());
            strokes += 1;
            hud.setStrokesText(strokes);
        }
    };

    const processKeyEvent = (event) => {
        let keyCode = event.which;

        //M Key
        if (keyCode == 77) { inGameMenu.toggle(); }
        //I key
        if (keyCode == 73) { debugScreen.toggleVisibility(); }

        if(gameOver) {
            return;
        }

        //N key
        if( keyCode == 78) { 
            scorecard.toggle();
        }
        ////P key
        //if( keyCode == 80) {
        //    scoreCallout.displayScore(par, strokes);
        //}
        //Up Arrow
        if (keyCode == 38) { strikeBall(); }
        //Down Arrow
        if (keyCode == 40) { ball.body.velocity = new CANNON.Vec3(0, 0, 0); }
        //W key
        if (keyCode == 87) { strikePower.increasePower(); }
        //S key
        if (keyCode == 83) { strikePower.decreasePower(); }
        //1 key
        if (keyCode == 49) { course = loadCourse(1); }
        //2 key
        if (keyCode == 50) { course = loadCourse(2); }
        //3 key
        if (keyCode == 51) { course = loadCourse(3); }
        //4 key
        if (keyCode == 52) { course = loadCourse(4); }
        //5 key
        if (keyCode == 53) { course = loadCourse(5); }
        //6 key
        if (keyCode == 54) { course = loadCourse(6); }
        //7 key
        if (keyCode == 55) { course = loadCourse(7); }
        //8 key
        if (keyCode == 56) { course = loadCourse(8); }
        //9 key
        if (keyCode == 57) { course = loadCourse(9); }

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
        debugScreen.addEntry("Course number: ", () => {
            return course.number;
        });
        debugScreen.addEntry("Camera pos: ", () => {
            return camera.position.x.toFixed(2) + ", " +
                camera.position.y.toFixed(2) + ", " +
                camera.position.z.toFixed(2);
        });

    }

    const world = {};



    const renderer = createRenderer();
    container.append(renderer.domElement);
    const camera = createCamera();
    const resizer = new Resizer(container, camera, renderer);
    const scene = createScene();
    const loop = createLoop(camera, scene, renderer);
    const audioHelper = createAudioHelper();
    const physWorld = createPhysWorld();
    const controls = createControls(camera, renderer.domElement);
    const debugScreen = createDebugScreen();
    const scorecard = createScorecard();
    const scoreCallout = createScoreCallout();
    const loadingScreen = createLoadingScreen();
    const continueButton = createContinueButton(); 
    let gameOver = false;

    camera.add(audioHelper.audioListener);

    let pointerControlsStrikePower = false;

    const strikePower = createStrikePower();

    const ball = createBall();
    const pointer = createPointer(ball, camera, strikePower);

    continueButton.setOnClick(() => {
        continueButton.hide();
        const maxCourse = 9; 

        if(course.number < maxCourse) {
            course = loadCourse(course.number + 1);
        } else {
            gameOverResponse(); 
        }
    });

    ball.updateTouchSphereScale = () => {
        const distance = controls.getDistance();
        const scale = Math.sqrt(distance / 3);
        ball.touchSphere.mesh.scale.setScalar(scale);
    };

    ball.onSettling = () => {
        if(ball.body.position.y < course.outOfBoundsYLevel) {
            ball.toLastPosition();
        } else  {
            ball.recordPosition();
        }
    };

    //https://github.com/schteppe/cannon.js/issues/202
    ball.raycastCollideCheck = (delta) => {
        const ballVelocity = ball.body.velocity.clone();
    
        const offset = ballVelocity.clone().unit().scale(ball.radius + 0.01);
        const from = ball.body.position.clone().vadd(offset);
        const to = from.clone().vadd(ball.body.velocity);

        const changeInPosition = ballVelocity.length()*(physWorld.dt);

        const raycastResult = new CANNON.RaycastResult;
        physWorld.raycastClosest(from, to, {}, raycastResult);

        if(raycastResult.hasHit) {
            if(changeInPosition > raycastResult.distance) {

                ball.body.position.copy(raycastResult.hitPointWorld);

                const overshotCorrectionVector = ballVelocity
                    .clone()
                    .unit()
                    .scale(-1.0*(ball.radius - 0.001));

                ball.body.position.vadd(overshotCorrectionVector, ball.body.position);
                ball.mesh.position.copy(ball.body.position);

            }
        }
    }

    //camera target
    controls.targetObj = ball.body;
    camera.targetObj = ball.body;

    let strokes = 0;
    let par;

    const hud = createHud();
    hud.pullStrikePowerPercent = () => {
        return strikePower.percentPower();
    };

    let course = loadCourse(1);

    const inGameMenu = createInGameMenu();
    inGameMenu.restartButton.onclick = () => {
        course = loadCourse(course.number); 
        inGameMenu.setState("closed");
    };

    for(let i = 0; i < 9; i++) {
        inGameMenu.levelBoxes[i].onclick = () => {
            course = loadCourse(i + 1);
            inGameMenu.setState("closed");
        };
    }

    //adding updatable objects to updating loop
    loop.updatables.push(physWorld);
    loop.updatables.push(ball);
    loop.updatables.push(camera);
    loop.updatables.push(controls);
    loop.updatables.push(pointer);
    loop.updatables.push(hud);
    loop.updatables.push(debugScreen);
    loop.updatables.push(scoreCallout);
    loop.updatables.push(loadingScreen);
    loop.updatables.push(continueButton);
    loop.targetCourse = course;

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
