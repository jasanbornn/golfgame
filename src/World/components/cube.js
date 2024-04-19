import { 
    BoxBufferGeometry, 
    MathUtils, 
    Mesh, 
    MeshStandardMaterial
} from 'https://cdn.skypack.dev/three@0.132.2';

import { Body, Box, Vec3 } from 'https://cdn.skypack.dev/cannon-es@0.20.0';

function createCube() {

    const materialSpec = {
        color: 'purple',
    }

    const size = 2; //meters
    const geometry = new BoxBufferGeometry(size, size, size);
    const material = new MeshStandardMaterial(materialSpec);
    const cube = {
        mesh: new Mesh(geometry, material),
        body: new Body({
            mass: 5, //kg
            shape: new Box(new Vec3(size / 2, size / 2, size / 2)),
        }),
    };

    cube.body.position.set(0, 10, 0);
    cube.body.quaternion.setFromEuler(-0.5, -0.1, 0.8);

    cube.mesh.position.copy(cube.body.position);
    cube.mesh.quaternion.copy(cube.body.quaternion);

    cube.tick = (delta) => {
        cube.mesh.position.copy(cube.body.position);
        cube.mesh.quaternion.copy(cube.body.quaternion);
    };

    return cube;
}

export { createCube };
