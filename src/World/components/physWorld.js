import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';

function createPhysWorld() {
    const options = {
        gravity: new CANNON.Vec3(0, -9.8, 0),
    };

    const physWorld = new CANNON.World(options);

    physWorld.tick = (delta) => {
        if(delta < 1 / 60) {
            physWorld.step(delta);
        } else {
            physWorld.fixedStep(1 / 60);
        }
    };

    return physWorld;
}

export { createPhysWorld };
