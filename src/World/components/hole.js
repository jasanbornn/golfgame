import { createBarrier } from './obstacles/barrier.js';
import { createGround } from './ground.js';
import { createCup } from './cup.js';

import { createHole1 } from './holes/hole1.js';
import { createHole2 } from './holes/hole2.js';
import { createHole3 } from './holes/hole3.js';
import { createHole4 } from './holes/hole4.js';
import { createHole5 } from './holes/hole5.js';
import { createHole6 } from './holes/hole6.js';
import { createHole7 } from './holes/hole7.js';
import { createHole8 } from './holes/hole8.js';
import { createHole9 } from './holes/hole9.js';

import * as THREE from '../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';
function createHole(holeNum) {
    let hole;
    const physMaterials = {
        barrier: new CANNON.Material('barrier'),
    }

    switch(holeNum) {
        case 1:
            hole = createHole1(physMaterials);
            break;
        case 2:
            hole = createHole2(physMaterials);
            break;
        case 3:
            hole = createHole3(physMaterials);
            break;
        case 4:
            hole = createHole4(physMaterials);
            break;
        case 5:
            hole = createHole5(physMaterials);
            break;
        case 6:
            hole = createHole6(physMaterials);
            break;
        case 7:
            hole = createHole7(physMaterials);
            break;
        case 8:
            hole = createHole8(physMaterials);
            break;
        case 9:
            hole = createHole9(physMaterials);
            break;
        default:
            hole = createHole1(physMaterials);
            break;
    }

    hole.number = holeNum;

    return hole;

}

export { createHole };
