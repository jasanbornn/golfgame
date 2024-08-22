import { CSG } from '../../../vendor/three-csg/three-csg.js';
import * as THREE from '../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';


function createGround(width, depth, position, quaternion, hole) {
    const geometry = new THREE.PlaneGeometry(width, depth);
    geometry.rotateX(-Math.PI / 2);
    const material = createMaterial(width, depth);
    const physMaterial = new CANNON.Material('ground');
    const groundHalfExtents = new CANNON.Vec3(width / 2, 0.5, depth / 2);
    const groundShape = new CANNON.Box(groundHalfExtents);
    const groundPreMesh = new THREE.Mesh(geometry, material);
    groundPreMesh.position.copy(position);
    groundPreMesh.quaternion.copy(quaternion);
    const ground = {
        mesh: createGroundHoleClip(groundPreMesh, hole),
        body: new CANNON.Body({
            type: CANNON.Body.STATIC,
            material: physMaterial,
            shape: groundShape,
        }),
    };

    ground.body.position.copy(position);
    ground.body.quaternion.copy(quaternion);
    ground.body.position.y -= 0.5;

    ground.body.material = new CANNON.Material({
        friction: 0.4,
        restitution: 0.2,
    });

    return ground;
}


//creates threejs mesh of hole shape subtracted from ground shape
function createGroundHoleClip(groundPreMesh, hole) {
    if(hole === undefined) {
        return groundPreMesh;
    }
    const clipGeometry = new THREE.CylinderGeometry(0.112, 0.112, 0.5, 32);
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

function createMaterial(width, depth) {

    const textureLoader = new THREE.TextureLoader();

    const texture = textureLoader.load(
        //'../../assets/dev-texture.png',
        '../../assets/grass.png',
    );

    texture.wrapS = THREE.RepeatedWrapping;
    texture.wrapT = THREE.RepeatedWrapping;

    texture.repeat.set(width, depth);

    return new THREE.MeshStandardMaterial({
        map: texture,
        //color: 'darkgreen',
    });
    
}

export { createGround };
