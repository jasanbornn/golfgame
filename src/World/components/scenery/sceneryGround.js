import * as THREE from './../../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';

function createSceneryGround() {
    const WIDTH = 100;
    const DEPTH = 100;

    const textureLoader = new THREE.TextureLoader();
    textureLoader.path = 'putt';
    const createMaterial = () => {
        textureLoader.load(
            '../../../assets/sceneryGrass.jpg',
            (texture) => { 
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(WIDTH, DEPTH)
                sceneryGround.mesh.material = new THREE.MeshStandardMaterial({
                    color: 0xCCCCCC,
                    map: texture,
                });
            },
        );
    }

    const geometry = new THREE.PlaneGeometry(WIDTH, DEPTH);
    geometry.rotateX(-Math.PI / 2);
    const material = new THREE.MeshStandardMaterial({
        color: 0x008013 // grass green
    });
    const mesh = new THREE.Mesh(geometry, material);
    const physMaterial = new CANNON.Material('ground');

    const body = new CANNON.Body({
        type: CANNON.Body.STATIC,
        material: physMaterial,
    });


    const sceneryGround = {
        mesh: mesh,
        body: body,
    }
    createMaterial();

    sceneryGround.mesh.position.set(0.0, -0.2, 0.0);
    sceneryGround.body.position.copy(sceneryGround.mesh.position);
    
    return sceneryGround;

} 

export { createSceneryGround };
