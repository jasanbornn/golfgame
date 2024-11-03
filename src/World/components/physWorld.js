import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';

function createPhysWorld() {
    const options = {
        gravity: new CANNON.Vec3(0, -9.8, 0),
    };

    const physWorld = new CANNON.World(options);

    physWorld.tick = (delta) => {
        if(document.hasFocus()) {
            physWorld.fixedStep(delta); 
        } else {
            physWorld.fixedStep(); 
        }
    };

    return physWorld;
}

export { createPhysWorld };
