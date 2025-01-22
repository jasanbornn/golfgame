import * as THREE from '../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';

function createPhysWorld() {
    //autostart = false
    const clock = new THREE.Clock(false);
    let time = 0;
    const dTime = 0.01;
    const timeStep = 1/60;
    let currentTime = performance.now() / 1000;
    let accumulator = 0.0;
    
    const options = {
        gravity: new CANNON.Vec3(0, -9.8, 0),
    };

    const physWorld = new CANNON.World(options);

    physWorld.solver.iterations = 20;

    physWorld.tick = (delta) => {

        let newTime = performance.now() / 1000;
        let frameTime = newTime - currentTime;
        currentTime = newTime;
        
        accumulator += frameTime;

        while(accumulator >= dTime) {
            physWorld.step(timeStep)
            accumulator -= dTime;
            time += dTime;
        }


        //physWorld.step(delta);
        //physWorld.fixedStep(1/3);
        //if(delta < 1 / 60) {
        //    physWorld.step(delta);
        //} else {
        //    physWorld.fixedStep(1 / 60);
        //}

    };

    return physWorld;
}

export { createPhysWorld };
