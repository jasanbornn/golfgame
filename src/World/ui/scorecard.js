function createScorecard() {
    //9 holes
    const scorecard = [null, null, null, null, null, null, null, null, null];

    const scorecardTable = document.getElementById("scorecard");
    const scorecardToggleButton = document.getElementById("scorecard-toggle-button");

    scorecard.totalScore  = 0;

    scorecard.setScore = (hole, scoreValue) => {
        scorecard[hole - 1] = scoreValue;
        scorecard.totalScore = 0;
        for(let i=0;i<scorecard.length;i++) {
            if(scorecard[i] != null) {
                scorecard.totalScore += scorecard[i];
            }
        }

        if(scoreValue == 0) {
            scorecardTable.rows[hole].cells[2].textContent = "";
        } else {
            scorecardTable.rows[hole].cells[2].textContent = scoreValue;
        }

        if(scorecard.totalScore == 0) {
            scorecardTable.rows[scorecardTable.rows.length - 1].cells[2].textContent = "";
        } else {
            scorecardTable.rows[scorecardTable.rows.length - 1].cells[2].textContent = scorecard.totalScore;
        }
    };

    scorecard.clearScores = () => {
        for(let i=0; i<scorecard.length; i++) {
            scorecard.setScore(i+1, 0);
        }
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
