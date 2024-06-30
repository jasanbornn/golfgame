import { CSG } from '../../../vendor/three-csg/three-csg.js';
import * as THREE from '../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';


function createGround(width, height, hole) {

    const geometry = new THREE.PlaneGeometry(width, height);
    geometry.rotateX(-Math.PI / 2);
    const material = createMaterial(width, height);
    const physMaterial = new CANNON.Material('ground');
    const groundHalfExtents = new CANNON.Vec3(width / 2, 0.5, height / 2);
    const groundShape = new CANNON.Box(groundHalfExtents);
    const ground = {
        mesh: createGroundHoleClip(new THREE.Mesh(geometry, material), hole),
        body: new CANNON.Body({
            type: CANNON.Body.STATIC,
            material: physMaterial,
            shape: groundShape,
        }),
    };

    ground.mesh.position.set(0, 0, 0);
    ground.body.position.copy(ground.mesh.position);
    ground.body.position.y -= 0.5;

    return ground;
}


//creates threejs mesh of hole shape subtracted from ground shape
function createGroundHoleClip(groundPreMesh, hole) {
    const clipGeometry = new THREE.CylinderGeometry(0.112, 0.112, 0.5, 32);
    const clipMaterial = new THREE.MeshStandardMaterial({
        color: 'red',
    });
    const clipMesh = new THREE.Mesh(clipGeometry, clipMaterial);
    clipMesh.position.copy(hole.mesh.position);
    clipMesh.position.y = groundPreMesh.position.y;

    //cut a hole in the ground using geometry subtraction
    groundPreMesh.updateMatrix();
    clipMesh.updateMatrix();
    const groundPreBSP = CSG.fromMesh(groundPreMesh);
    const clipBSP = CSG.fromMesh(clipMesh);
    const groundPostBSP = groundPreBSP.subtract(clipBSP);
    const groundPostMesh = CSG.toMesh( groundPostBSP, groundPreMesh.matrix, groundPreMesh.material);

    return groundPostMesh;
}

function createMaterial(width, height) {

    const textureLoader = new THREE.TextureLoader();

    const texture = textureLoader.load(
        //'../../assets/dev-texture.png',
        '../../assets/grass.png',
    );

    texture.wrapS = THREE.RepeatedWrapping;
    texture.wrapT = THREE.RepeatedWrapping;

    texture.repeat.set(width, height);

    return new THREE.MeshStandardMaterial({
        map: texture,
        //color: 'darkgreen',
    });
    
}

export { createGround };
