import * as THREE from '../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';

function createPhysWorld() {
    //autostart = false
    const clock = new THREE.Clock(false);
    const timeStep = 1/60;
    let lastCallTime;

    const options = {
        gravity: new CANNON.Vec3(0, -9.8, 0),
    };

    const physWorld = new CANNON.World(options);

    physWorld.solver.iterations = 50;

    physWorld.tick = (delta) => {
        //physWorld.step(timeStep, delta);
        
        //physWorld.fixedStep(1/60);

        if(delta < 1 / 60) {
            physWorld.step(delta);
        } else {
            physWorld.fixedStep(1 / 60);
        }

    };

    return physWorld;
}

export { createPhysWorld };
