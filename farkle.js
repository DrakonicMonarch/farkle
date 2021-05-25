//TODO: implement multiplayer and improve ui
var diceArr = [];
var score = 0;
var bankedScore = 0;
var rolled = false;

function initializeDice() {
    for (i = 0; i < 6; i++) {
        diceArr[i] = {};
        diceArr[i].id = `die${i + 1}`;
        diceArr[i].value = i + 1;
        diceArr[i].clicked = false;
        diceArr[i].set = false; //added to record if a dice is kept and therefore can no longer be clicked or changed
    }
    rolled = false;
}

/*Rolling dice values*/
function setValues() {
    for (var i = 0; i < 6; i++) {
        if (diceArr[i].clicked) {
            diceArr[i].set = true;
        }
        if (!diceArr[i].set) {
            diceArr[i].value = Math.floor(Math.random() * 6 + 1);
        }
    }
}

/*Calls all necessary actions on dice roll*/
function rollDice() {
    var clickedStatus = checkForClicked();
    rolled = true;
    if (clickedStatus == 'success') {
        var scoreStatus = updateScore();
        if (scoreStatus == 'success') {
            setValues();
            updateDiceImg();
            farkleStatus = checkForFarkle();
            if (farkleStatus != 'safe') {
                score = 0;
                document.getElementById('score').innerHTML = 'Farkle!';
                sendToast(farkleStatus);
            }
        } else {
            resetClicked();
            sendToast(scoreStatus);
        }
    } else {
        sendToast(clickedStatus);
    }
}

/*Resets any clicked buttons to unclicked state if not kept*/
function resetClicked() {
    for (i = 0; i < 6; i++) {
        if (!diceArr[i].set && diceArr.clicked) {
            document.getElementById(`die${i + 1}`).classList.toggle('transparent');
            diceArr[i].clicked = false;
        }
    }
}

//TODO: create toasts instead of logs
/*handles any toast messages that need to be sent*/
function sendToast(error) {
    console.log(error);
}

/*Updating images of dice given values of rollDice*/
function updateDiceImg() {
    var diceImage;
    for (var i = 0; i < 6; i++) {
        diceImage = 'images/' + diceArr[i].value + '.png';
        document.getElementById(diceArr[i].id).setAttribute('src', diceImage);
    }
}

/*Selects and deselects dice*/
function diceClick(img) {
    if (rolled) {
        var i = img.getAttribute('data-number');
        if (!diceArr[i].set) {
            img.classList.toggle('transparent');
            if (!diceArr[i].clicked) {
                diceArr[i].clicked = true;
            } else {
                diceArr[i].clicked = false;
            }
        }
    }
}

//TODO: Needs fixing
/*Checks for a Farkle*/
function checkForFarkle() {
    var diceNum = [0, 0, 0, 0, 0, 0];
    for (i = 0; i < 6; i++) {
        if (diceArr[i].clicked && !diceArr[i].set) {
            diceNum[diceArr[i].value - 1]++;
        }
    }
    for (i = 0; i < 6; i++) {
        if (i == 0 || i == 4) {
            if (diceNum[i] > 0) {
                return 'safe';
            }
        } else {
            if (diceNum[i] == 3) {
                return 'safe';
            }
        }
    }
    return 'Farkle! Too bad!';
}

/*Checks for any clicked dice that aren't already kept*/
function checkForClicked() {
    if (!rolled) {
        return 'success';
    }
    for (i = 0; i < 6; i++) {
        if (diceArr[i].clicked) {
            return 'success';
        }
    }
    return "You haven't clicked any new dice!";
}

/*Updates the score*/
function updateScore() {
    var diceNum = [0, 0, 0, 0, 0, 0];
    var tempScore = 0;
    //checks how many of each value are selected
    for (i = 0; i < 6; i++) {
        if (diceArr[i].clicked && !diceArr[i].set) {
            diceNum[diceArr[i].value - 1]++;
        }
    }
    for (i = 0; i < 6; i++) {
        if (diceNum[i] > 0) {
            if (i == 0) {
                if (diceNum[i] == 3) {
                    tempScore += 1000;
                } else {
                    tempScore += diceNum[i] * 100;
                }
                break;
            } else if (i == 4) {
                if (diceNum[i] == 3) {
                    tempScore += 500;
                } else {
                    tempScore += diceNum[i] * 50;
                }
                break;
            } else {
                if (diceNum[i] == 3) {
                    tempScore += (i + 1) * 100;
                } else {
                    return 'Incompatable dice configuration. Please select different dice.';
                }
            }
        }
    }
    score += tempScore;
    document.getElementById('score').innerHTML = score;
    return 'success';
}

function bankScore() {
    bankedScore += score;
    score = 0;
    document.getElementById('bankedscore').innerHTML = bankedScore;
    document.getElementById('score').innerHTML = score;
    initializeDice();
}