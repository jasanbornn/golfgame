import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';

function createPhysWorld() {
    const options = {
        gravity: new CANNON.Vec3(0, -5.0, 0),
    };

    const physWorld = new CANNON.World(options);

    physWorld.tick = (delta) => {
        physWorld.fixedStep(); 
    };

    return physWorld;
}

export { createPhysWorld };
