import { CSG } from '../../../vendor/three-csg/three-csg.js';
import * as THREE from '../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';


function createGround(width, length, position, quaternion, hole) {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.path = 'putt';
    const createMaterial = (width, length) => {
        ground.mesh.material = new THREE.MeshStandardMaterial({
            color: 0x446644,
        });

        ground.mesh.material.map = textureLoader.load(
            '../../assets/grass.png',
            (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(width / 4, length / 4);
            },
            // progress
            undefined,
            //on error
            (xhr) => {
                console.log('error loading texture'); 
            },
        );

        ground.mesh.material.normalScale = new THREE.Vector2(0.1, 0.1);
        ground.mesh.material.normalMap = textureLoader.load(
            '../../assets/grass_norm.png',
            (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(width / 4, length / 4);
            },
            // progress
            undefined,
            //on error
            (xhr) => {
                console.log('error loading texture'); 
            },
        );
    }
    
    //https://discourse.threejs.org/t/different-textures-on-each-face-of-cube/23700

    const createBottomMaterial = (width, length) => {
        const loadSideTexture = (dimension) => {
            return textureLoader.load(
                '../../assets/bricks.png',
                (texture) => {
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    texture.repeat.set(dimension, 12);
                },
                // progress
                undefined,
                //on error
                (xhr) => {
                    console.log('error loading texture'); 
                },
            );
        };
        const loadSideNormalMap = (dimension) => {
            return textureLoader.load(
                '../../assets/bricks_norm.png',
                (texture) => {
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    texture.repeat.set(dimension, 12);
                },
                // progress
                undefined,
                //on error
                (xhr) => {
                    console.log('error loading texture'); 
                },
            );
        };

        bottomMesh.material[0] = new THREE.MeshStandardMaterial({
            clippingPlanes: [bottomGeoClipPlane],
        });
        bottomMesh.material[1] = new THREE.MeshStandardMaterial({
            clippingPlanes: [bottomGeoClipPlane],
        });
        bottomMesh.material[4] = new THREE.MeshStandardMaterial({
            clippingPlanes: [bottomGeoClipPlane],
        });
        bottomMesh.material[5] = new THREE.MeshStandardMaterial({
            clippingPlanes: [bottomGeoClipPlane],
        });

        bottomMesh.material[0].map = loadSideTexture(length);
        bottomMesh.material[1].map = loadSideTexture(length);
        bottomMesh.material[4].map = loadSideTexture(width);
        bottomMesh.material[5].map = loadSideTexture(width);

        bottomMesh.material[0].normalMap = loadSideNormalMap(length);
        bottomMesh.material[1].normalMap = loadSideNormalMap(length);
        bottomMesh.material[4].normalMap = loadSideNormalMap(width);
        bottomMesh.material[5].normalMap = loadSideNormalMap(width);

    }

    //geometry of the top surface of the ground
    const surfaceGeometry = new THREE.PlaneGeometry(width, length);
    //face upwards
    surfaceGeometry.rotateX(-Math.PI / 2);
    const surfaceMaterial = new THREE.MeshStandardMaterial({
        color: 0x008013, // grass green
    });

    //mesh of the top surface before hole is cut into it
    const surfacePreMesh = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
    surfacePreMesh.position.copy(position);
    surfacePreMesh.quaternion.copy(quaternion);

    //calculate axis angle
    //
    // ------------------------------------ horizon
    // |\ axisAngle 
    // | \          = angle between ground slope and horizon
    // |  \ 
    // |   \ 
    // |    \
    // |     \
    // |      \  <-- sloped ground
    // |       \
    //
    const horizQuaternion = new THREE.Quaternion().copy(quaternion); 
    horizQuaternion.x = 0.0;
    horizQuaternion.z = 0.0;
    horizQuaternion.normalize();
    const axisAngle = quaternion.angleTo(horizQuaternion);

    //length is the length of the sloped side of the ground
    //the flat bottom portion will be smaller
    //in hindsight I should have made the slope length be calculated
    //based off a given bottom length. maybe todo but would need a lot
    //of refactoring for course 1-9 data
    const bottomLength = length * Math.cos(axisAngle);
    const bottomGeometry = new THREE.BoxGeometry(width, 16, bottomLength);

    //made the bottom section perpendicular to the ground
    //without this the bottom section would extend 
    //perpendicullarly from the slope surface
    bottomGeometry.rotateX(-axisAngle);

    //the bottom section starts as a rectangular cuboid shape. the top
    //is then cut off to match up with the sloped surface.
    //this plane is set to the same angle as the sloped surface
    const bottomGeoClipPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(
        new THREE.Vector3( 0, -1.0, 0).applyQuaternion(quaternion),
        surfacePreMesh.position,
    );

    //bottom section mesh material properties
    //const bottomMaterial = new THREE.MeshStandardMaterial({
    //    color: 0xCCCCCC,
    //    clippingPlanes: [bottomGeoClipPlane],
    //});
    
    const bottomMaterial = [
        new THREE.MeshStandardMaterial(),
        new THREE.MeshStandardMaterial(), 
        new THREE.MeshStandardMaterial(),
        new THREE.MeshStandardMaterial(),
        new THREE.MeshStandardMaterial(),
        new THREE.MeshStandardMaterial(),
    ];

    for(const mat of bottomMaterial) {
        mat.setValues({
            color: 0xCCCCCC,
            clippingPlanes: [bottomGeoClipPlane],
        });
    }

    //bottom section mesh
    const bottomMesh = new THREE.Mesh(bottomGeometry, bottomMaterial);

    //collision box of the bottom portion of the ground
    //const groundHeight = 1.0;
    //const groundHalfExtents = new CANNON.Vec3(width / 2, groundHeight, length / 2);
    //const groundShape = new CANNON.Box(groundHalfExtents);
    const groundShape = new CANNON.ConvexPolyhedron({
        vertices: calculateVertices(width, bottomLength, position, axisAngle),
        faces: calculateFaces(),
    });

    const ground = {
        mesh: clipSurface(surfacePreMesh, hole),
        body: new CANNON.Body({
            type: CANNON.Body.STATIC,
            material: new CANNON.Material({
                friction: 1.0,
                restitution: 0.5,
            }),
        }),
    };


    ground.mesh.add(bottomMesh);
    ground.body.addShape(groundShape, new CANNON.Vec3(0.0, 0.0, 0.0));

    createMaterial(width, length);
    createBottomMaterial(width, length);

    ground.mesh.name = "ground";

    ground.body.position.copy(position);
    ground.body.quaternion.copy(quaternion);
    ground.body.quaternion.x = 0.0;
    ground.body.quaternion.z = 0.0;
    ground.body.quaternion.normalize();

    return ground;
}


//cuts hole into the top surface
function clipSurface(surfacePreMesh, hole) {
    if(hole === undefined) {
        return surfacePreMesh;
    }
    const clipGeometry = new THREE.CylinderGeometry(0.112, 0.112, 0.4, 32);
    const clipMaterial = new THREE.MeshStandardMaterial({
        color: 'red',
    });
    const clipMesh = new THREE.Mesh(clipGeometry, clipMaterial);
    clipMesh.position.copy(hole.mesh.position);

    //cut a hole in the top surface using geometry subtraction
    //https://en.wikipedia.org/wiki/Constructive_solid_geometry
    surfacePreMesh.updateMatrix();
    clipMesh.updateMatrix();
    const surfacePreBSP = CSG.fromMesh(surfacePreMesh);
    const clipBSP = CSG.fromMesh(clipMesh);
    const surfacePostBSP = surfacePreBSP.subtract(clipBSP);
    const surfacePostMesh = CSG.toMesh( surfacePostBSP, surfacePreMesh.matrix, surfacePreMesh.material);

    return surfacePostMesh;
}

//https://stackoverflow.com/questions/78137248/how-to-create-exact-sized-shapes-with-convexpolyhedron-in-cannon-es-and-three-js
function calculateVertices(width, length, position, axisAngle) {
    //lowest point of the ground collision
    //keeping this constant makes implementation easier
    //and works okay since grounds are not designed to float
    const colliderBottom = -16.0;
    const vertices = [
        //+x +y +z vertex 0
        new CANNON.Vec3(width / 2, -length*Math.tan(axisAngle) / 2, length / 2),
        //-x +y +z vertex 1
        new CANNON.Vec3(-width / 2, -length*Math.tan(axisAngle) / 2, length / 2),
        //-x +y -z vertex 2
        new CANNON.Vec3(-width / 2, length*Math.tan(axisAngle) / 2, -length / 2),
        //+x +y -z vertex 3
        new CANNON.Vec3(width / 2, length*Math.tan(axisAngle) / 2, -length / 2),

        //+x -y +z vertex 4
        new CANNON.Vec3(width / 2, colliderBottom, length / 2),
        //-x -y +z vertex 5
        new CANNON.Vec3(-width / 2, colliderBottom, length / 2),
        //-x -y -z vertex 6
        new CANNON.Vec3(-width / 2, colliderBottom, -length / 2),
        //+x -y -z vertex 7
        new CANNON.Vec3(width / 2, colliderBottom, -length / 2),
    ];

    return vertices;
}

function calculateFaces() {

    const faces = [
        [1, 2, 6, 5], // -x 
        [3, 0, 4, 7], // +x
        [6, 7, 4, 5], // -y 
        [1, 0, 3, 2], // +y 
        [2, 3, 7, 6], // -z 
        [0, 1, 5, 4], // +z 
    ];

    return faces;
}

export { createGround };
