import * as THREE from '../../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';

function createWindmillBase(position, quaternion) {

    const BOTTOM_PIECE_WIDTH = 0.3;
    const BOTTOM_PIECE_HEIGHT = 0.3;
    const TOP_PIECE_BOTTOM_WIDTH = BOTTOM_PIECE_WIDTH*3;
    const BOTTOM_PIECE_DEPTH = TOP_PIECE_BOTTOM_WIDTH;
    const TOP_PIECE_TOP_WIDTH = 0.4 * TOP_PIECE_BOTTOM_WIDTH;
    const TOP_PIECE_HEIGHT = 2.0;

    const material = new THREE.MeshStandardMaterial({
        color: 'red',
    });

    const botLeftGeometry = new THREE.BoxGeometry(
        BOTTOM_PIECE_WIDTH,
        BOTTOM_PIECE_HEIGHT,
        TOP_PIECE_BOTTOM_WIDTH,
    );

    const botLeftMesh = new THREE.Mesh(botLeftGeometry, material);

    const botRightGeometry = new THREE.BoxGeometry(
        BOTTOM_PIECE_WIDTH,
        BOTTOM_PIECE_HEIGHT,
        TOP_PIECE_BOTTOM_WIDTH,
    );

    const botRightMesh = new THREE.Mesh(botRightGeometry, material);

    const topGeometry = new THREE.CylinderGeometry(
        TOP_PIECE_TOP_WIDTH / 1.41,
        TOP_PIECE_BOTTOM_WIDTH / 1.41,
        TOP_PIECE_HEIGHT,
        4, //radial segments - square base
    );
    topGeometry.rotateY(Math.PI / 4);

    const topMesh = new THREE.Mesh(topGeometry, material);

    topMesh.add(botLeftMesh)
    topMesh.add(botRightMesh);

    botLeftMesh.position.y -= (TOP_PIECE_HEIGHT / 2 + BOTTOM_PIECE_HEIGHT / 2);
    botLeftMesh.position.x -= BOTTOM_PIECE_WIDTH;

    botRightMesh.position.y -= (TOP_PIECE_HEIGHT / 2 + BOTTOM_PIECE_HEIGHT / 2);
    botRightMesh.position.x += BOTTOM_PIECE_WIDTH;


    topMesh.position.copy(position);
    topMesh.quaternion.copy(quaternion);

    topMesh.position.y += (TOP_PIECE_HEIGHT / 2) + BOTTOM_PIECE_HEIGHT;


    const botLeftBodyShape = new CANNON.Box(new CANNON.Vec3(
        BOTTOM_PIECE_WIDTH / 2,
        BOTTOM_PIECE_HEIGHT / 2,
        BOTTOM_PIECE_DEPTH / 2,
    ));

    const botRightBodyShape = new CANNON.Box(new CANNON.Vec3(
        BOTTOM_PIECE_WIDTH / 2,
        BOTTOM_PIECE_HEIGHT / 2,
        BOTTOM_PIECE_DEPTH / 2,
    ));

    const topBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Box(new CANNON.Vec3(
            TOP_PIECE_BOTTOM_WIDTH / 2,
            TOP_PIECE_HEIGHT / 2,
            TOP_PIECE_BOTTOM_WIDTH / 2,
        )),
    });

    topBody.position.copy(topMesh.getWorldPosition(new THREE.Vector3()));
    topBody.quaternion.copy(topMesh.getWorldQuaternion(new THREE.Quaternion()));

    topBody.addShape(botLeftBodyShape, new CANNON.Vec3(
        -BOTTOM_PIECE_WIDTH, 
        -(TOP_PIECE_HEIGHT / 2 + BOTTOM_PIECE_HEIGHT / 2),
        0,
    ));
    topBody.addShape(botRightBodyShape, new CANNON.Vec3(
        BOTTOM_PIECE_WIDTH, 
        -(TOP_PIECE_HEIGHT / 2 + BOTTOM_PIECE_HEIGHT / 2),
        0,
    ));

    const windmillBase = {
        mesh: topMesh,
        body: topBody,
    };

    return windmillBase;
}

function createWindmillBlades(windmillBasePosition, windmillBaseQuaternion) {

    const BLADE_WIDTH = 0.33;
    const BLADE_LENGTH = 2.6;
    const BLADE_THICKNESS = 0.1;

    const bladeGeometry1 = new THREE.BoxGeometry(
        BLADE_WIDTH,
        BLADE_LENGTH,
        BLADE_THICKNESS,
    );

    const bladeGeometry2 = new THREE.BoxGeometry(
        BLADE_LENGTH,
        BLADE_WIDTH,
        BLADE_THICKNESS,
    );

    const bladeMaterial = new THREE.MeshStandardMaterial({
        color: 'white',
    });

    const bladesMesh = new THREE.Mesh(bladeGeometry1, bladeMaterial);
    const bladeMesh2 = new THREE.Mesh(bladeGeometry2, bladeMaterial);

    bladesMesh.add(bladeMesh2);
    bladesMesh.position.copy(windmillBasePosition);
    bladesMesh.quaternion.copy(windmillBaseQuaternion);
    bladesMesh.translateZ(0.5);

    const bladesBody = new CANNON.Body({
        type: CANNON.Body.KINEMATIC,
        shape: new CANNON.Box(new CANNON.Vec3(
            BLADE_WIDTH / 2,
            BLADE_LENGTH / 2,
            BLADE_THICKNESS / 2,
        )),
    });

    bladesBody.addShape(
        new CANNON.Box(new CANNON.Vec3(
            BLADE_LENGTH / 2,
            BLADE_WIDTH / 2,
            BLADE_THICKNESS / 2,
        )),
    );

    bladesBody.position.copy(bladesMesh.getWorldPosition(new THREE.Vector3()));
    bladesBody.quaternion.copy(bladesMesh.getWorldQuaternion(new THREE.Quaternion()));

    bladesBody.angularVelocity = new CANNON.Vec3(0.0, 0.0, 1.5*Math.PI);

    const windmillBlades = {
        mesh: bladesMesh,
        body: bladesBody,
    }

    windmillBlades.tick = (delta) => {
        windmillBlades.mesh.quaternion.copy(windmillBlades.body.quaternion);
    }

    return windmillBlades;

}

export { createWindmillBase, createWindmillBlades };
