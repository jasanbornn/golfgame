import { WebGLRenderer } from 'https://cdn.skypack.dev/three@0.132.2';

function createRenderer() {
    const options = {
        antialias: true,
    };

    const renderer = new WebGLRenderer(options);

    // enable physically correct lighting model
    renderer.physicallyCorrectLights = true;

    return renderer;
}

export { createRenderer };
