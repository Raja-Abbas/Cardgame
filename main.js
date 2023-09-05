const buttons = document.querySelectorAll('.draggable');
const timerElement = document.getElementById('timer');
const resultMessage = document.getElementById('result-message');
const tryAgainButton = document.getElementById('try-again-button');
const highScoreList = document.getElementById('high-score-list'); 
const highestTimeElement = document.getElementById('highest-time'); 
let draggedButton = null;
let timerInterval;
let highScores = 8; 
let highestScore = parseInt(localStorage.getItem('highestScore')) || 30 * 60;
let gameWon = false; 


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i].textContent, array[j].textContent] = [array[j].textContent, array[i].textContent];
    }
}

function resetGame() {
    clearInterval(timerInterval);
    timerElement.textContent = '00:30';
    resultMessage.textContent = '';
    tryAgainButton.style.display = 'none';
    gameWon = false;

    buttons.forEach((button) => {
        button.draggable = true;
    });

    shuffleArray([...buttons]);
    startTimer();
}
tryAgainButton.addEventListener('click', resetGame);

function startTimer() {
    let totalSeconds = 1/2 * 60;
    timerElement.textContent = formatTime(totalSeconds);
    timerInterval = setInterval(() => {
        if (!gameWon) {
            totalSeconds--;
        }

        if (totalSeconds < 0) {
            clearInterval(timerInterval);
            buttons.forEach((button) => {
                button.draggable = false;
            });

            if (isButtonsInOrder()) {
                gameWon = true;
                resultMessage.textContent = "You won!";
                const timeTaken = 30 * 60 - totalSeconds;
                if (timeTaken < highestScore) {
                    highestScore = timeTaken; 
                    localStorage.setItem('highestScore', highestScore); 
                }
                addHighScore(timeTaken);
                displayHighScores();
                displayHighestTime(highestScore); 
            }
            else {
                resultMessage.textContent = "Try again!";
            }
        } else {
            timerElement.textContent = formatTime(totalSeconds);
        }
        tryAgainButton.style.display = 'block'; 
    }, 1000);
}

function isButtonsInOrder() {
    let previousValue = 0;
    for (const button of buttons) {
        const buttonValue = parseInt(button.textContent);
        if (buttonValue < previousValue) {
            return false;
        }
        previousValue = buttonValue;
    }
    return true;
}

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function addHighScore(time) {
    const currentHighestScore = localStorage.getItem('highestScore');

    if (time < currentHighestScore || currentHighestScore === null) {
        localStorage.setItem('highestScore', time);
    }
}


function displayHighScores() {
    highScoreList.innerHTML = '';

    for (let i = 0; i < highScores.length; i++) {
        const listItem = document.createElement('li');
        listItem.textContent = formatTime(highScores[i]);
        highScoreList.appendChild(listItem);
    }
}

function displayHighestTime(time) {
    highestTimeElement.textContent = formatTime(time);
}




startTimer();
buttons.forEach((button) => {
    button.addEventListener('dragstart', (event) => {
        if (timerElement.textContent !== "00:00") {
            draggedButton = event.target;
        }
    });

    button.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    button.addEventListener('drop', (event) => {
        if (!gameWon && draggedButton !== null && draggedButton !== event.target) {
            const temp = event.target.textContent;
            event.target.textContent = draggedButton.textContent;
            draggedButton.textContent = temp;

            if (isButtonsInOrder()) {
                gameWon = true;
                resultMessage.textContent = "You won!";
                const timeTaken = 1/2 * 60 - parseInt(timerElement.textContent.split(':')[0]) * 60 - parseInt(timerElement.textContent.split(':')[1]);
                addHighScore(timeTaken); 
                displayHighScores();
                displayHighestTime(timeTaken); 
            }
        }
        draggedButton = null;
    });
});

function updateHighestScore(newScore) {
    if (newScore < highestScore) {
        highestScore = newScore;
        localStorage.setItem('highestScore', highestScore.toString());
        highestTimeElement.textContent = formatTime(highestScore);
    }
}
highestTimeElement.textContent = formatTime(highestScore);
