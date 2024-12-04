function createScorecard() {
    //9 holes
    const scorecard = [null, null, null, null, null, null, null, null, null];

    const scorecardTable = document.getElementById("scorecard");

    let scoreSum  = 0;

    const updateScorecard = (hole, scoreValue) => {
        scoreSum += scoreValue;
        scorecardTable.rows[hole].cells[2].textContent = scoreValue;
        scorecardTable.rows[scorecardTable.rows.length - 1].cells[2].textContent = scoreSum;
    }

    scorecard.setScore = (hole, scoreValue) => {
        scorecard[hole - 1] = scoreValue;
        updateScorecard(hole, scoreValue);
    };

    scorecard.toggle = () => {
        if( scorecardTable.classList.toggle('scorecard-hide-animation') ) {
            scorecardTable.classList.remove('scorecard-show-animation');
        } else {
            scorecardTable.classList.add('scorecard-show-animation');
            scorecardTable.classList.remove('scorecard-hide-animation');
        }
    }

    return scorecard;
}

export { createScorecard };
