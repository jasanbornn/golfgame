import * as THREE from '../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';

function createPhysWorld() {
    const timeStep = 1/120;
    
    const options = {
        gravity: new CANNON.Vec3(0, -9.8, 0),
    };

    const physWorld = new CANNON.World(options);

    physWorld.solver.iterations = 50;

    physWorld.tick = (delta) => {
        physWorld.fixedStep(timeStep, 10);
    }

    return physWorld;
}

export { createPhysWorld };
