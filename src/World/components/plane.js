import { 
    PlaneGeometry,
    MathUtils, 
    Mesh, 
    MeshStandardMaterial,
    TextureLoader
} from 'https://cdn.skypack.dev/three@0.132.2';

import { Body, Plane, Vec3 } from 'https://cdn.skypack.dev/cannon-es@0.20.0';


function createPlane() {

    const geometry = new PlaneGeometry(32, 32);
    const material = createMaterial();
    const plane = {
        mesh: new Mesh(geometry, material),
        body: new Body({
            type: Body.STATIC,
            shape: new Plane(),
        }),
    };

    plane.body.position.set(0, 0, 0);
    plane.body.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // face plane upwards

    plane.mesh.position.copy(plane.body.position);
    plane.mesh.quaternion.copy(plane.body.quaternion);

    return plane;
}

function createMaterial() {

//    return new MeshStandardMaterial({
//        color: 'darkgreen',
//    });

    const textureLoader = new TextureLoader();

    const texture = textureLoader.load(
        '../../assets/dev-texture.png',
    );

    const material = new MeshStandardMaterial({
        map: texture,
    });

    return material;
    
}

export { createPlane };
