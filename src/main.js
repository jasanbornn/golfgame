import { createWorld } from './World/World.js';

function main() {
    const container = document.querySelector('#scene-container');
    //const world = new World(container);
    const world = createWorld(container);
    world.start();
}

main();
