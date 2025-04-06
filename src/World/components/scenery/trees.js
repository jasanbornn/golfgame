import * as THREE from './../../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';

import { GLTFLoader } from '../../../../vendor/three/addons/GLTFLoader.js';


function createTrees(clearingPosition, clearingRadius, groundHeight) {

    let treeScene = null;

    const NUM_TREES = 100;  

    const randBetween = (low, high) => {
        return (Math.random() * (high - low)) + low;
    }

    const treePoints = [];

    const MIN_DISPL = -24;
    const MAX_DISPL = 24;
    for(let i = 0; i < NUM_TREES; i++) {
        const spawnAttempt = new THREE.Vector3(
            randBetween(MIN_DISPL, MAX_DISPL), 
            groundHeight,
            randBetween(MIN_DISPL, MAX_DISPL), 
        );
        if(spawnAttempt.distanceTo(clearingPosition) < clearingRadius) {
            i--;
        } else {
            treePoints.push(spawnAttempt);
        }
    }

    const trees = [];

    for(const treePosition of treePoints) {
        const treeQuaternion = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0.0, 1.0, 0.0),
            randBetween(0, 2*Math.PI),
        );

        trees.push(createTree(treePosition, treeQuaternion));

    }

    const gltfLoader = new GLTFLoader();
    const url = 'assets/trees/test-cropped.gltf';
    //gltfLoader.setPath('putt/');
    gltfLoader.load(url, (gltf) => {
        const treeScene = gltf.scene;
        for(const tree of trees) {
            const treeChoice = Math.round(randBetween(0, 2));
            const treePosition = tree.mesh.position.clone();
            const treeQuaternion = tree.mesh.quaternion.clone();
            tree.mesh.copy(treeScene.children[treeChoice].clone(), true);
            
            //tree is a group and has children instead of
            //a mesh itself. not setting this to false causes an error
            //during rendering when looking for the tree's mesh's geometry
            tree.mesh.isMesh = false;

            tree.mesh.position.copy(treePosition);
            tree.mesh.quaternion.copy(treeQuaternion);
        }
    });

    return trees;
}

function createTree(position, quaternion) {
    
    const treeBodyRadius = 0.4 // meters
    const treeBodyHeight = 3.0 // meters
    const treeBodyShape = new CANNON.Cylinder(
        treeBodyRadius,
        treeBodyRadius,
        treeBodyHeight,
    );
    const treeBody = new CANNON.Body({
        type: CANNON.STATIC,
        shape: treeBodyShape,
    });

    const treeGeometry = new THREE.BoxGeometry(0, 0, 0);
    const treeMaterial = new THREE.MeshStandardMaterial();
    const tree = {
        mesh: new THREE.Mesh(treeGeometry, treeMaterial),
        body: treeBody
    }
    
    tree.body.position.copy(position);

    tree.mesh.position.copy(position);
    tree.mesh.quaternion.copy(quaternion);

    return tree;

}

export { createTrees };
