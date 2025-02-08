import { CSG } from '../../../vendor/three-csg/three-csg.js';
import * as THREE from '../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';


function createGround(width, depth, position, quaternion, hole) {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.path = 'putt';
    const createMaterial = (width, depth) => {
        textureLoader.load(
            '../../assets/grass.png',
            (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(width / 4, depth / 4);
                ground.mesh.material = new THREE.MeshStandardMaterial({
                    color: 0x446644,
                    map: texture,
                });
            },
        );
        textureLoader.load(
            '../../assets/grass_norm.png',
            (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(width / 4, depth / 4);
                ground.mesh.material.normalMap = texture;
                ground.mesh.material.normalScale = new THREE.Vector2(0.1, 0.1);
            },
        );
    }

    const createBottomMaterial = (width, depth) => {
        textureLoader.load(
            '../../assets/wood.jpg',
            (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(width, depth);
                bottomMesh.material = new THREE.MeshStandardMaterial({
                    color: 0x654321,
                    map: texture,
                    clippingPlanes: [bottomGeoClipPlane],
                });
            },
        );
    }

    const geometry = new THREE.PlaneGeometry(width, depth);
    geometry.rotateX(-Math.PI / 2);
    const material = new THREE.MeshStandardMaterial({
        color: 0x008013, // grass green
    });
    const groundPreMesh = new THREE.Mesh(geometry, material);
    groundPreMesh.position.copy(position);
    groundPreMesh.quaternion.copy(quaternion);

    const physMaterial = new CANNON.Material('ground');
    const groundHalfExtents = new CANNON.Vec3(width / 2, 0.5, depth / 2);
    const groundShape = new CANNON.Box(groundHalfExtents);

    const bottomGeometry = new THREE.BoxGeometry(width, 10, depth);

    let forwardQuaternion = new THREE.Quaternion();
    forwardQuaternion.copy(groundPreMesh.quaternion);
    forwardQuaternion.x = 0.0;
    forwardQuaternion.z = 0.0;
    forwardQuaternion.normalize();
    bottomGeometry.rotateX(-groundPreMesh.quaternion.angleTo(forwardQuaternion));

    const bottomGeoClipPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(
        new THREE.Vector3( 0, -1.0, 0,).applyQuaternion(quaternion),
        groundPreMesh.position,
    );

    const bottomMaterial = new THREE.MeshStandardMaterial({
        color: 0x654321,
        clippingPlanes: [bottomGeoClipPlane],
    });

    const bottomMesh = new THREE.Mesh(bottomGeometry, bottomMaterial);

    const ground = {
        mesh: createGroundHoleClip(groundPreMesh, hole),
        body: new CANNON.Body({
            type: CANNON.Body.STATIC,
            material: physMaterial,
        }),
    };

    ground.mesh.add(bottomMesh);
    ground.body.addShape(groundShape, new CANNON.Vec3(0.0, -0.5, 0.0));

    createMaterial(width, depth);
    createBottomMaterial(width, depth);

    ground.body.position.copy(position);
    ground.body.quaternion.copy(quaternion);

    ground.body.material = new CANNON.Material({
        friction: 1.0,
        restitution: 0.2,
    });

    return ground;
}


//creates threejs mesh of hole shape subtracted from ground shape
function createGroundHoleClip(groundPreMesh, hole) {
    if(hole === undefined) {
        return groundPreMesh;
    }
    const clipGeometry = new THREE.CylinderGeometry(0.112, 0.112, 0.4, 32);
    const clipMaterial = new THREE.MeshStandardMaterial({
        color: 'red',
    });
    const clipMesh = new THREE.Mesh(clipGeometry, clipMaterial);
    clipMesh.position.copy(hole.mesh.position);
    //clipMesh.position.sub(groundPreMesh.position);
    //clipMesh.position.y = groundPreMesh.position.y;

    //cut a hole in the ground using geometry subtraction
    //https://en.wikipedia.org/wiki/Constructive_solid_geometry
    groundPreMesh.updateMatrix();
    clipMesh.updateMatrix();
    const groundPreBSP = CSG.fromMesh(groundPreMesh);
    const clipBSP = CSG.fromMesh(clipMesh);
    const groundPostBSP = groundPreBSP.subtract(clipBSP);
    const groundPostMesh = CSG.toMesh( groundPostBSP, groundPreMesh.matrix, groundPreMesh.material);

    return groundPostMesh;
}

export { createGround };
