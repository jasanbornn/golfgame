import * as THREE from '../../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';

function createWedge() {
    
    const base = new THREE.Shape();
    const lengthA = 0.4;
    const lengthB = 0.4;
    const height = 0.1;

    base.moveTo(0, 0);
    base.lineTo(lengthA, 0);
    base.lineTo(0, lengthB);
    base.lineTo(0, 0);

    const extrudeSettings = {
        depth: height, 
        bevelEnabled: false,
    };

    const geometry = new THREE.ExtrudeGeometry( base, extrudeSettings);
    geometry.rotateX(-Math.PI/2);
    geometry.rotateY(-Math.PI/2);

    const material = new THREE.MeshStandardMaterial({
        color: 'orange',
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(-0.2, 0, 1);

    // vertices:
    //  +x                +z
    //     5------------4
    //     | * .    .*  |    
    //     |     3      |
    //     2-----|------1
    //       * . |  .*
    //           0
    const wedgeShape = new CANNON.ConvexPolyhedron({
        vertices: [
            new CANNON.Vec3(0, 0, 0), // 1
            new CANNON.Vec3(0, 0, lengthA), // 2
            new CANNON.Vec3(lengthB, 0, 0), // 3

            new CANNON.Vec3(0, height, 0), // 4
            new CANNON.Vec3(0, height, lengthA), // 5
            new CANNON.Vec3(lengthB, height, 0), // 6
        ],
        faces: [
            [0, 1, 2], // +y
            [3, 4, 5], // -y
            [0, 3, 5, 2], // -z
            [0, 1, 4, 3], // -x
            [1, 2, 5, 4], // +xz
        ],
    });

    const body = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: wedgeShape,
        material: new CANNON.Material({
            friction: 0.7,
            restitution: 1.0,
        }),
    });
    body.position.copy(mesh.position);

    const wedge = {
        mesh: mesh,
        body: body,
    }

    return wedge;
}

export { createWedge };
