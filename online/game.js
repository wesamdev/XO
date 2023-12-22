// Connect to the server using Socket.IO
const socket = io();

socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
});

socket.on('connect_timeout', () => {
    console.error('Connection timeout');
});

socket.on('disconnect', (reason) => {
    console.error('Disconnected:', reason);
});

let currentTurn = "X";
let gameFinished = false;
let boardArray = Array(9).fill(null);

const gridItems = document.getElementsByClassName("sqaure");
const currentPlayerDisplay = document.getElementById("instruction");

for (const item of gridItems) {
    item.addEventListener("click", function () {
        if (gameFinished) {
            return;
        }

        const value = item.getAttribute("value");
        const index = value - 1;

        if (boardArray[index] === "X" || boardArray[index] === "O") {
            return;
        }

        // Emit the move event with the move data
        socket.emit("move", { value, currentPlayer: currentTurn });
    });
}

document.getElementById("reset-btn").addEventListener("click", function () {
    // Emit the reset event
    socket.emit("reset");
});

// Listen for the move event from the server
socket.on("move", (data) => {
    const { value, currentPlayer } = data;

    // Update the board
    const squareContent = document.querySelector(`.sqaure[value='${value}'] .sqaure-content`);
    squareContent.innerHTML = currentPlayer;
    squareContent.classList.add('animate__animated', 'animate__bounceIn');

    // Update the internal board array
    const index = value - 1;
    boardArray[index] = currentPlayer;

    checkWinner();

    // Switch to the next player's turn
    currentTurn = currentTurn === "X" ? "O" : "X";
    currentPlayerDisplay.textContent = `It's ${currentTurn} turn`;
});

// Listen for the reset event from the server
socket.on("reset", () => {
    // Reset the game on all clients
    reset();
});

function checkWinner() {
    if (
        (boardArray[0] == boardArray[1] && boardArray[1] == boardArray[2]) ||
        (boardArray[3] == boardArray[4] && boardArray[4] == boardArray[5]) ||
        (boardArray[6] == boardArray[7] && boardArray[7] == boardArray[8]) ||
        (boardArray[0] == boardArray[3] && boardArray[3] == boardArray[6]) ||
        (boardArray[1] == boardArray[4] && boardArray[4] == boardArray[7]) ||
        (boardArray[2] == boardArray[5] && boardArray[5] == boardArray[8]) ||
        (boardArray[0] == boardArray[4] && boardArray[4] == boardArray[8]) ||
        (boardArray[2] == boardArray[4] && boardArray[4] == boardArray[6])
    ) {
        var winner = currentTurn === "X" ? "X" : "O";
        gameFinished = true;
        Swal.fire(`${winner} is the winner`);
    }

    var isDraw = true;
    for (const square of boardArray) {
        if (square !== "X" && square !== "O") {
            isDraw = false;
        }
    }

    if (isDraw) {
        gameFinished = true;
        Swal.fire("Draw");
    }
}

function reset() {
    for (const item of gridItems) {
        const value = item.getAttribute("value");
        const squareContent = document.querySelector(`.sqaure[value='${value}'] .sqaure-content`);

        squareContent.classList.remove('animate__animated', 'animate__bounceIn');
        squareContent.classList.add('animate__animated', 'animate__bounceOut');

        squareContent.addEventListener('animationend', (animation) => {
            if (animation.animationName == "bounceOut") {
                squareContent.classList.remove('animate__animated', 'animate__bounceOut');
                squareContent.innerHTML = "";
            }
        });
    }

    boardArray = Array(9).fill(null);
    currentTurn = "X";
    gameFinished = false;
    currentPlayerDisplay.textContent = `It's ${currentTurn} turn`;
}
