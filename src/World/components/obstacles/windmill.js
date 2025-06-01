import * as THREE from '../../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';

function createWindmillBase(position, quaternion) {

    const BOTTOM_PIECE_WIDTH = 0.25;
    const BOTTOM_PIECE_HEIGHT = 0.1;
    const TOP_PIECE_BOTTOM_WIDTH = BOTTOM_PIECE_WIDTH*3;
    const BOTTOM_PIECE_DEPTH = TOP_PIECE_BOTTOM_WIDTH;
    const TOP_PIECE_TOP_WIDTH = 0.60 * TOP_PIECE_BOTTOM_WIDTH;
    const TOP_PIECE_HEIGHT = 1.8;
    const TOP_PIECE_RADIAL_SEGMENTS = 4;

    const textureLoader = new THREE.TextureLoader();
    const createMaterial = () => {
        const material = new THREE.MeshStandardMaterial({
            color: 'red',
            roughness: 1.0,
            metalness: 0.25,
            flatShading: true,
        });
        material.map = textureLoader.load('assets/windmill/rubber.jpg');
        material.normalMap = textureLoader.load('assets/windmill/rubber_norm.jpg');

        return material;
    };

    const material = createMaterial();

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
        TOP_PIECE_TOP_WIDTH / Math.sqrt(2),
        TOP_PIECE_BOTTOM_WIDTH / Math.sqrt(2),
        TOP_PIECE_HEIGHT,
        TOP_PIECE_RADIAL_SEGMENTS,
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

    windmillBase.mesh.name = "windmill_base";

    return windmillBase;
}

function createWindmillBlades(windmillBasePosition, windmillBaseQuaternion) {

    const BLADE_WIDTH = 0.15;
    const BLADE_LENGTH = 1.95;
    const BLADE_THICKNESS = 0.01;
    const BLADE_OFFSET = 0.4;

    const SHAFT_WIDTH = 0.1;
    const SHAFT_LENGTH = 0.3;
    const SHAFT_RADIAL_SEGMENTS = 8;

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

    const bladeShaftGeometry = new THREE.CylinderGeometry(
        SHAFT_WIDTH / 2,
        SHAFT_WIDTH / 2,
        SHAFT_LENGTH,
        SHAFT_RADIAL_SEGMENTS,
    );
    bladeShaftGeometry.rotateX(Math.PI / 2);

    const textureLoader = new THREE.TextureLoader();
    const createBladeMaterial = () => {
        const material = new THREE.MeshStandardMaterial({
            color: 'white',
            roughness: 1.0,
            metalness: 0.25,
            flatShading: true,
        });
        material.map = textureLoader.load('assets/windmill/metal.jpg');
        material.normalMap = textureLoader.load('assets/windmill/metal_norm.jpg');

        return material;
    };

    const bladeMaterial = createBladeMaterial();

    const bladesMesh = new THREE.Mesh();
    const bladeMesh1 = new THREE.Mesh(bladeGeometry1, bladeMaterial);
    const bladeMesh2 = new THREE.Mesh(bladeGeometry2, bladeMaterial);

    const bladeShaftMesh = new THREE.Mesh(bladeShaftGeometry, bladeMaterial);
    bladeShaftMesh.translateZ(-(SHAFT_LENGTH / 2 + BLADE_THICKNESS + 0.00001));

    bladesMesh.add(bladeMesh1);
    bladesMesh.add(bladeMesh2);
    bladesMesh.add(bladeShaftMesh);
    bladesMesh.position.copy(windmillBasePosition);
    bladesMesh.quaternion.copy(windmillBaseQuaternion);
    bladesMesh.translateZ(BLADE_OFFSET);

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

    
    bladesBody.angularVelocity = new CANNON.Vec3(0.0, 0.0, 0.75*Math.PI);

    const windmillBlades = {
        mesh: bladesMesh,
        body: bladesBody,
    }

    windmillBlades.mesh.name = "windmill_blades";

    windmillBlades.tick = (delta) => {
        windmillBlades.mesh.quaternion.copy(windmillBlades.body.quaternion);
    }

    return windmillBlades;

}

export { createWindmillBase, createWindmillBlades };
