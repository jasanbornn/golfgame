import * as THREE from './../../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';

function createSceneryGround(position) {
    const WIDTH = 50;
    const DEPTH = 50;

    const textureLoader = new THREE.TextureLoader();
    const createMaterial = () => {
        sceneryGround.mesh.material = new THREE.MeshStandardMaterial({ color: 0x005000});
        sceneryGround.mesh.material.map = textureLoader.load(
            'assets/scenery_grass.png',
            (texture) => { 
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(WIDTH / 10, DEPTH / 10)
            },
        );

        sceneryGround.mesh.material.normalScale = new THREE.Vector2(1.0, 1.0);
        sceneryGround.mesh.material.normalMap = textureLoader.load(
            'assets/scenery_grass_norm.png',
            (texture) => { 
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(WIDTH, DEPTH);
            },
        );
    }

    const geometry = new THREE.PlaneGeometry(WIDTH, DEPTH);
    geometry.rotateX(-Math.PI / 2);
    const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
    const physMaterial = new CANNON.Material('ground');

    const groundHalfExtents = new CANNON.Vec3(WIDTH / 2, 0.5, DEPTH / 2);
    const groundShape = new CANNON.Box(groundHalfExtents);

    const body = new CANNON.Body({
        type: CANNON.Body.STATIC,
        material: physMaterial,
    });
    body.addShape(groundShape, new CANNON.Vec3(0.0, -0.5, 0.0));
    body.material = new CANNON.Material({
        friction: 1.0,
        restitution: 0.2,
    });

    const sceneryGround = {
        mesh: mesh,
        body: body,
    }
    createMaterial();

    sceneryGround.mesh.name = "scenery_ground";

    sceneryGround.mesh.position.copy(position);
    sceneryGround.body.position.copy(sceneryGround.mesh.position);
    
    return sceneryGround;

} 

export { createSceneryGround };
