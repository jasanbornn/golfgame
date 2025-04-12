function createScorecard() {
    //9 holes
    const scorecard = [null, null, null, null, null, null, null, null, null];

    const scorecardTable = document.getElementById("scorecard");
    const scorecardToggleButton = document.getElementById("scorecard-toggle-button");

    let scoreSum  = 0;

    const updateScorecard = (hole, scoreValue) => {
        scoreSum = 0;
        for(let i=0;i<scorecard.length;i++) {
            if(scorecard[i] != null) {
                scoreSum += scorecard[i];
            } else {
                break;
            }
        }
        scorecardTable.rows[hole].cells[2].textContent = scoreValue;
        scorecardTable.rows[scorecardTable.rows.length - 1].cells[2].textContent = scoreSum;
    }

    scorecard.setScore = (hole, scoreValue) => {
        scorecard[hole - 1] = scoreValue;
        updateScorecard(hole, scoreValue);
    };

    scorecard.toggle = () => {
        if( scorecardTable.classList.toggle('scorecard-show-animation') ) {
            scorecardTable.classList.remove('scorecard-hide-animation');
            return true;
        } else {
            scorecardTable.classList.add('scorecard-hide-animation');
            scorecardTable.classList.remove('scorecard-show-animation');
            return false;
        }
    }

    scorecardToggleButton.onclick = () => {
        if(scorecard.toggle()) {
            scorecardToggleButton.innerText = 'Hide';
        } else {
            scorecardToggleButton.innerText = 'Score';
        }
    };

    return scorecard;
}

export { createScorecard };
