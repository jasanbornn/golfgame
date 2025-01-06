import * as THREE from '../../../vendor/three/build/three.module.js';

function createLoadingScreen() {
    //autostart = false
    const clock = new THREE.Clock(false);

    const loadingScreenDiv = document.getElementById("loading-screen");

    const loadingScreen = {}; 

    loadingScreen.show = () => {
        loadingScreenDiv.style.pointerEvents = "auto";
        if( loadingScreenDiv.classList.toggle('loading-screen-fade-in-animation') ) {
            loadingScreenDiv.classList.remove('loading-screen-fade-out-animation');
        }
        clock.start();
    }

    loadingScreen.tick = (delta) => {
        if(clock.getElapsedTime() >= 2.0) {
            if( loadingScreenDiv.classList.toggle('loading-screen-fade-out-animation') ) {
                loadingScreenDiv.classList.remove('loading-screen-fade-in-animation');
            } 
            clock.start();
            clock.stop();
            loadingScreenDiv.style.pointerEvents = "none";
        }
    }

    return loadingScreen;
}

export { createLoadingScreen };
