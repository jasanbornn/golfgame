import * as THREE from '../../../vendor/three/build/three.module.js';
const clock = new THREE.Clock();

function createLoop(camera, scene, renderer) {
    const loop = {
        camera: camera,
        scene: scene,
        renderer: renderer,
        updatables: [],
    }

    loop.animate = () => {
        requestAnimationFrame(loop.animate);
        loop.tick();
        loop.renderer.render(loop.scene, loop.camera); 
    }

    loop.start = () => {
        loop.animate();
    }

    loop.stop = () => {
        //
    }

    loop.tick = () => {
        const delta = clock.getDelta();

        for (const object of loop.updatables) {
            object.tick(delta);
        }
    }

    return loop;
}

export { createLoop };
