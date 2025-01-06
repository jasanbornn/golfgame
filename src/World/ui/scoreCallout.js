import * as THREE from '../../../vendor/three/build/three.module.js';

function createScoreCallout() {
    //autostart = false
    const clock = new THREE.Clock(false);

    const scoreCalloutTextBox = document.getElementById('score-callout-container');
    const scoreCalloutText = document.getElementById('score-callout-text');
    
    const scoreCallout = {};

    scoreCallout.displayScore = (par, strokes) => {
        if(strokes == 1) {
            scoreCalloutText.textContent = 'Hole in One!';
        } else {
            switch(strokes - par) { 
                case -3:
                    scoreCalloutText.textContent = 'Double Eagle!';
                    break;
                case -2:
                    scoreCalloutText.textContent = 'Eagle';
                    break;
                case -1:
                    scoreCalloutText.textContent = 'Birdie';
                    break;
                case 0:
                    scoreCalloutText.textContent = 'Par';
                    break;
                case 1:
                    scoreCalloutText.textContent = 'Bogey';
                    break;
                case 2:
                    scoreCalloutText.textContent = 'Double Bogey :(';
                    break;
                default:
                    scoreCalloutText.textContent = strokes + ' strokes...';
                    break;
            }
        }

        //classlist.toggle returns whether or not the class is added after being called
        //https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/toggle
        
        if( scoreCalloutTextBox.classList.toggle('score-callout-show-animation') ) {
            scoreCalloutTextBox.classList.remove('score-callout-hide-animation');
        }
        clock.start();
    }

    scoreCallout.tick = (delta) => {
        //console.log(clock.getElapsedTime());
        if(clock.getElapsedTime() >= 2.0) {
        if( scoreCalloutTextBox.classList.toggle('score-callout-hide-animation') ) {
            scoreCalloutTextBox.classList.remove('score-callout-show-animation');
        } 
            clock.start();
            clock.stop();
        }
    }

    return scoreCallout;
}

export { createScoreCallout };
