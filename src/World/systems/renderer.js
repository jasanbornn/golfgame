import * as THREE from '../../../vendor/three/build/three.module.js';

function createRenderer() {
    const options = {
        antialias: true,
    };

    const renderer = new THREE.WebGLRenderer(options);

    // enable physically correct lighting model
    renderer.physicallyCorrectLights = true;

    return renderer;
}

export { createRenderer };
