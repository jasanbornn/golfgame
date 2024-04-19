import { DirectionalLight } from 'https://cdn.skypack.dev/three@0.132.2';

function createLights() {
    // create a directional light
    const light = new DirectionalLight(
        'white', //color
        8 //intensity
    );

    light.castShadow = true;

    // position the light
    light.position.set(10, 10, 10);

    return light;
}

export { createLights };
