function createEndScreen() {

    const endScreenBackground = document.getElementById("end-screen");
    const leaderboard = document.getElementById("leaderboard");

    const xhr = new XMLHttpRequest();

    const endScreen = {
        state: "inactive"
    };

    endScreen.setState = (state) => {
        endScreen.state = state;
        switch(state) {
            case "active":
                leaderboard.style.display = "flex";
                endScreenBackground.style.display = "flex";
                break;
            case "inactive":
                leaderboard.style.display = "none";
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
    endScreen.dbConnectTest = () => {
        const data = "game_data=dataforgame";
        xhr.open("POST", "../php/db_connect.php");
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(data);
    }

    const DONE = 4;
    const HTTP_OK = 200;
    xhr.onreadystatechange = () => {
        if(xhr.readyState == DONE) {
            if(xhr.status == HTTP_OK) {
                //console.log("Fetch success: " + xhr.responseText);
                endScreen.setLeaderboardContent(xhr.responseText);
            } else {
                console.log("Error fetching end screen data. status: " + xhr.status);
            }
        }
    };

    return endScreen;
}

export { createEndScreen };
