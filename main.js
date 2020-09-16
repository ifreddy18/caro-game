"use strict";
// Class
class Player {
    constructor(name, figure) {
        this.name = name;
        this.figure = figure;
        this.turn = false;
        this.showPlayer = () => {
            console.log(`
                Name: ${this.name}
                Figure: ${this.figure}
                Turn: ${this.turn}
            `);
        };
    }
}

// On load
window.onload = () => {
    initElements();
    initEventListeners();
    label_player_1.classList.add("active_turn");
};

// Init Players
var playerOne = new Player("Player 1", "X");
var playerTwo = new Player("Player 2", "O");
playerOne.turn = true;
var winner = false;

// Init boards
var winConditionArrow = 5;
var boardRows = 12;
var boardColumns = 16;
var boardInputs = [[], [], [], [], [], [], [], [], [], [], [], []]; // boardRows 12

// Init elementos
function initElements() {
    // Header
    var new_game_btn = document.getElementById("new_game_btn");
    // Board
    var boardLayout = document.getElementById("board");
    // Players
    var label_player_1 = document.getElementById("label_player_1");
    var label_player_2 = document.getElementById("label_player_2");
    // Modal
    var end_game_modal = document.getElementById("end_game_modal");
    var new_game_btn_modal = document.getElementById("new_game_btn_modal");
    var exit_modal = document.getElementById("exit_modal");
    var player_win = document.getElementById("player_win");

    var cont = 0;
    // Squares
    for (let i = 0; i < boardRows; i++) {
        for (let j = 0; j < boardColumns; j++) {
            boardInputs[i][j] = document.getElementsByClassName("square")[cont];
            cont++;
            if (i == boardRows - 1 && j == boardColumns - 1) {
                cont = 0;
            }
        }
    }
}

// Init EventListeners
function initEventListeners() {
    // Squares
    for (let i = 0; i < boardRows; i++) {
        for (let j = 0; j < boardColumns; j++) {
            boardInputs[i][j].addEventListener("click", () => {
                selectSquare(boardInputs[i][j]);
            });
        }
    }

    // Buttons
    new_game_btn.addEventListener("click", startNewGame);
    exit_modal.addEventListener("click", exitModal);
    new_game_btn_modal.addEventListener("click", startNewGame);
}

function startNewGame() {
    for (let i = 0; i < boardRows; i++) {
        for (let j = 0; j < boardColumns; j++) {
            boardInputs[i][j].disabled = false;
            boardInputs[i][j].value = "";
            boardInputs[i][j].classList.remove("winSquare");
            boardInputs[i][j].classList.remove("figure-player-one");
            boardInputs[i][j].classList.remove("figure-player-two");
        }
    }

    playerOne.turn = true;
    playerTwo.turn = false;
    label_player_1.classList.add("active_turn");
    label_player_2.classList.remove("active_turn");

    winner = false;
    end_game_modal.style.display = "none";
}

function exitModal() {
    end_game_modal.style.display = "none";

    for (let i = 0; i < boardRows; i++) {
        for (let j = 0; j < boardColumns; j++) {
            boardInputs[i][j].disabled = "disabled";
        }
    }
}

function nextTurn() {
    if (playerOne.turn) {
        playerOne.turn = false;
        playerTwo.turn = true;
        label_player_1.classList.remove("active_turn");
        label_player_2.classList.add("active_turn");
    } else if (playerTwo.turn) {
        playerOne.turn = true;
        playerTwo.turn = false;
        label_player_1.classList.add("active_turn");
        label_player_2.classList.remove("active_turn");
    } else {
        console.log("Error: No player selected");
    }
}

// Listener al dar click en un cuadro
function selectSquare(square) {
    // Square status
    var playerFigure;

    if (playerOne.turn) {
        square.value = playerOne.figure;
        playerFigure = playerOne.figure;
    } else if (playerTwo.turn) {
        square.value = playerTwo.figure;
        playerFigure = playerTwo.figure;
    } else {
        console.log("Error: No player selected");
    }

    customSquare(square, playerFigure);
    nextTurn();
    square.disabled = "disabled";

    // Win Condition
    let row_index = parseInt(square.getAttribute("data-row-index"));
    let col_index = parseInt(square.getAttribute("data-col-index"));
    evaluateBoard(row_index, col_index, playerFigure);
}

// Evalua el tablero y realiza los cambios CSS en caso de que haya un ganador
function evaluateBoard(row_index, col_index, playerFigure) {
    console.log(`[row][col]:[${row_index}][${col_index}]`);
    // Evaluar condiciones
    // cond = 4 => vertical, horizontal, diagonal 1 y diagonal 2
    for (let condition = 1; condition <= 4; condition++) {
        try {
            evaluateWinCondition(condition, row_index, col_index, playerFigure);
        } catch (e) {
            // Ignore TypeError: Board border
        }
    }

    // Si hay ganador
    if (winner) {
        console.log("Ha ganado el jugador: " + playerFigure);
        let playerWinner;
        if (playerFigure == playerOne.figure) {
            playerWinner = playerOne.name;
        } else if (playerFigure == playerTwo.figure) {
            playerWinner = playerTwo.name;
        }

        player_win.innerText = `${playerWinner} WON!!!`;
        end_game_modal.style.display = "block";
    } else {
        return console.log("Next player's turn");
    }
}

// Evalua que se cumplan las condiciones de victoia
function evaluateWinCondition(condition, row_index, col_index, playerFigure) {
    switch (condition) {
        case 1: // Diagonal \
            for (let x = 0; x <= winConditionArrow; x++) {
                try {
                    if (
                        boardInputs[row_index + (x - 4)][col_index + (x - 4)]
                            .value == playerFigure &&
                        boardInputs[row_index + (x - 3)][col_index + (x - 3)]
                            .value == playerFigure &&
                        boardInputs[row_index + (x - 2)][col_index + (x - 2)]
                            .value == playerFigure &&
                        boardInputs[row_index + (x - 1)][col_index + (x - 1)]
                            .value == playerFigure &&
                        boardInputs[row_index + x][col_index + x].value ==
                            playerFigure
                    ) {
                        boardInputs[row_index + (x - 4)][
                            col_index + (x - 4)
                        ].classList.add("winSquare");
                        boardInputs[row_index + (x - 3)][
                            col_index + (x - 3)
                        ].classList.add("winSquare");
                        boardInputs[row_index + (x - 2)][
                            col_index + (x - 2)
                        ].classList.add("winSquare");
                        boardInputs[row_index + (x - 1)][
                            col_index + (x - 1)
                        ].classList.add("winSquare");
                        boardInputs[row_index + x][col_index + x].classList.add(
                            "winSquare"
                        );
                        winner = true;
                        // No se cierra con break para evaluar si el jugador gano por más de un lado
                    }
                } catch (e) {
                    // Ignore TypeError: Board border
                }
            }
            break;

        case 2: // Diagonal /
            for (let x = 0; x <= winConditionArrow; x++) {
                try {
                    if (
                        boardInputs[row_index + (x - 4)][col_index + (4 - x)]
                            .value == playerFigure &&
                        boardInputs[row_index + (x - 3)][col_index + (3 - x)]
                            .value == playerFigure &&
                        boardInputs[row_index + (x - 2)][col_index + (2 - x)]
                            .value == playerFigure &&
                        boardInputs[row_index + (x - 1)][col_index + (1 - x)]
                            .value == playerFigure &&
                        boardInputs[row_index + x][col_index - x].value ==
                            playerFigure
                    ) {
                        boardInputs[row_index + (x - 4)][
                            col_index + (4 - x)
                        ].classList.add("winSquare");
                        boardInputs[row_index + (x - 3)][
                            col_index + (3 - x)
                        ].classList.add("winSquare");
                        boardInputs[row_index + (x - 2)][
                            col_index + (2 - x)
                        ].classList.add("winSquare");
                        boardInputs[row_index + (x - 1)][
                            col_index + (1 - x)
                        ].classList.add("winSquare");
                        boardInputs[row_index + x][col_index - x].classList.add(
                            "winSquare"
                        );
                        winner = true;
                        // No se cierra con break para evaluar si el jugador gano por más de un lado
                    }
                } catch (e) {
                    // Ignore TypeError: Board border
                }
            }
            break;

        case 3: // Horizontal
            for (let x = 0; x <= winConditionArrow; x++) {
                try {
                    if (
                        boardInputs[row_index][col_index + (x - 4)].value ==
                            playerFigure &&
                        boardInputs[row_index][col_index + (x - 3)].value ==
                            playerFigure &&
                        boardInputs[row_index][col_index + (x - 2)].value ==
                            playerFigure &&
                        boardInputs[row_index][col_index + (x - 1)].value ==
                            playerFigure &&
                        boardInputs[row_index][col_index + x].value ==
                            playerFigure
                    ) {
                        boardInputs[row_index][
                            col_index + (x - 4)
                        ].classList.add("winSquare");
                        boardInputs[row_index][
                            col_index + (x - 3)
                        ].classList.add("winSquare");
                        boardInputs[row_index][
                            col_index + (x - 2)
                        ].classList.add("winSquare");
                        boardInputs[row_index][
                            col_index + (x - 1)
                        ].classList.add("winSquare");
                        boardInputs[row_index][col_index + x].classList.add(
                            "winSquare"
                        );
                        winner = true;
                        // No se cierra con break para evaluar si el jugador gano por más de un lado
                    }
                } catch (e) {
                    // Ignore TypeError: Board border
                }
            }
            break;

        case 4: // Vertical
            for (let x = 0; x <= winConditionArrow; x++) {
                try {
                    if (
                        boardInputs[row_index + (x - 4)][col_index].value ==
                            playerFigure &&
                        boardInputs[row_index + (x - 3)][col_index].value ==
                            playerFigure &&
                        boardInputs[row_index + (x - 2)][col_index].value ==
                            playerFigure &&
                        boardInputs[row_index + (x - 1)][col_index].value ==
                            playerFigure &&
                        boardInputs[row_index + x][col_index].value ==
                            playerFigure
                    ) {
                        boardInputs[row_index + (x - 4)][
                            col_index
                        ].classList.add("winSquare");
                        boardInputs[row_index + (x - 3)][
                            col_index
                        ].classList.add("winSquare");
                        boardInputs[row_index + (x - 2)][
                            col_index
                        ].classList.add("winSquare");
                        boardInputs[row_index + (x - 1)][
                            col_index
                        ].classList.add("winSquare");
                        boardInputs[row_index + x][col_index].classList.add(
                            "winSquare"
                        );
                        winner = true;
                    }
                } catch (e) {
                    // Ignore TypeError: Board border
                }
            }
            break;

        default:
            break;
    }
}

function customSquare(square, figure) {
    if (figure == playerOne.figure) {
        square.classList.add("figure-player-one");
    } else if (figure == playerTwo.figure) {
        square.classList.add("figure-player-two");
    }
}
