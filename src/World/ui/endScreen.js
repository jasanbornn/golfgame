function createEndScreen() {

    const endScreenBackground = document.getElementById("end-screen");
    const leaderboard = document.getElementById("leaderboard");

    const submissionContainer = document.getElementById("end-screen-submission-container");
    const leaderboardNameInput = document.getElementById("leaderboard-name-input");
    const leaderboardSubmitButton = document.getElementById("leaderboard-submit-button");

    const quitContainer = document.getElementById("end-screen-quit-container");
    const quitButton = document.getElementById("end-screen-quit-button");
    const replayButton = document.getElementById("replay-button");

    const xhr = new XMLHttpRequest();

    const endScreen = {
        state: "inactive",
        quitButton: quitButton,
        replayButton: replayButton,
    };

    endScreen.setState = (state) => {
        endScreen.state = state;
        switch(state) {
            case "submit":
                endScreenBackground.style.display = "flex";
                submissionContainer.style.display = "flex";
                quitContainer.style.display = "none";
                break;
            case "quitting":
                endScreenBackground.style.display = "flex";
                submissionContainer.style.display = "none";
                quitContainer.style.display = "flex";
                break;
            case "inactive":
                endScreenBackground.style.display = "none";
                break;
            default:
                endScreen.setState("inactive");
        }
    };

    endScreen.setLeaderboardContent = (content) => {
        leaderboard.innerHTML = content;
    };

    //https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API
    endScreen.queryLeaderboard = () => {
        xhr.open("POST", "../php/leaderboard_report.php");
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send();
    }

    const submitScore = (score) => {
        const name = leaderboardNameInput.value;
        const data = "name=" + name + "&score=" + score;
        xhr.open("POST", "../php/submit_score.php");
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(data);
    };

    const DONE = 4;
    const HTTP_OK = 200;
    xhr.onreadystatechange = () => {
        if(xhr.readyState == DONE) {
            if(xhr.status == HTTP_OK) {
                if(xhr.responseText[0] == '<') {
                    endScreen.setLeaderboardContent(xhr.responseText);
                } else if(xhr.responseText[0] == '\n') {
                    console.log("Submit response: " + xhr.responseText);
                    endScreen.setState("quitting");
                    endScreen.queryLeaderboard();
                } else if(xhr.responseText == "") {
                    console.log("Null XHR response");
                    endScreen.setLeaderboardContent("<p>no scores</p>");
                } else {
                    console.log("Other XHR response: " + xhr.responseText);
                }
            } else {
                console.log("Error fetching end screen data. status: " + xhr.status);
            }
        }
    };

    endScreen.score = 0;
    endScreen.setScore = (strokes) => {
        endScreen.score = strokes;
    }

    leaderboardSubmitButton.onclick = () => { submitScore(endScreen.score); };

    return endScreen;
}

export { createEndScreen };
