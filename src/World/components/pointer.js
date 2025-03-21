// pointer to help aim golf ball

import * as THREE from '../../../vendor/three/build/three.module.js';

function createPointer(ball, camera, strikePower) {

    //pointer dimensions (meters)
    const ARROW_TAIL_WIDTH = 0.05;
    const ARROW_TAIL_LENGTH = 4.0;
    const ARROW_HEAD_WIDTH = 0.125;
    const ARROW_HEAD_LENGTH = 1.0;
    const ARROW_LENGTH = ARROW_TAIL_LENGTH + ARROW_HEAD_LENGTH;

    //pointer shape
    const arrowShape = new THREE.Shape();
    arrowShape.moveTo(0,0);
    arrowShape.lineTo(ARROW_TAIL_WIDTH / 2, 0);
    arrowShape.lineTo(ARROW_TAIL_WIDTH / 2, ARROW_TAIL_LENGTH);
    arrowShape.lineTo(ARROW_HEAD_WIDTH / 2, ARROW_TAIL_LENGTH);
    arrowShape.lineTo(0, ARROW_LENGTH);
    arrowShape.lineTo(-ARROW_HEAD_WIDTH / 2, ARROW_TAIL_LENGTH);
    arrowShape.lineTo(-ARROW_TAIL_WIDTH / 2, ARROW_TAIL_LENGTH);
    arrowShape.lineTo(-ARROW_TAIL_WIDTH / 2, 0);
    arrowShape.lineTo(0,0);

    const extrudeSettings = {
        depth: 0.01,
        bevelEnabled: false,
    };

    const geometry = new THREE.ExtrudeGeometry(arrowShape, extrudeSettings);
    //rotate so pointer points towards its positive z axis
    geometry.rotateX(Math.PI / 2);
    const material = new THREE.MeshStandardMaterial({
        color: 0xAAAAAA,
    });

    const pointer = {
        mesh: new THREE.Mesh(geometry, material),
    };

    pointer.mesh.name = "pointer";

    //position pointer slightly below the ball's center line
    pointer.mesh.position.y -= 0.03;
    pointer.tick = () => {

        //copy camera quaternion into pointer's quaternion
        //pointer will point at camera
        pointer.mesh.quaternion.copy(camera.quaternion);

        //rotate 180 degrees 
        //to point in same direction as camera
        pointer.mesh.rotateY(Math.PI);

        //rotate to vertical plane
        //(get rid of up-down rotation)
        pointer.mesh.quaternion.x = 0.0;
        pointer.mesh.quaternion.z = 0.0;
        pointer.mesh.quaternion.normalize();

        //position the pointer at the golf ball
        pointer.mesh.position.copy(camera.targetObj.position);
        
        //push the arrow forward 0.4 meters
        pointer.mesh.translateZ(0.4);

        //make pointer visible only when the ball is not moving
        if(ball.isSettled()) {
            pointer.mesh.visible = true;
        } else {
            pointer.mesh.visible = false;
        }

        //pointer.mesh.scale.set(1.0, 1.0, 0.3);
        //scale the pointer based on strike power
        pointer.mesh.scale.set(1.0, 1.0, 0.5*strikePower.percentPower());


        

    };


    return pointer;
}

export { createPointer };
