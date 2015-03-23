
////// Constants
// The board
var SQUARES;
// Board markings
var EMPTY = " ";
var X = "X";
var O = "O";
// The board indices where we have a win
var WINS = [[0,1,2],[3,4,5],[6,7,8],
            [0,3,6],[1,4,7],[2,5,8],
            [0,4,8],[2,4,6]];
// String indicating human player (as opposed to the plethora of possible ais)
var HUMAN = "human";

////// Globals
// The engine for each player
var players;
// Whose turn is it right now
var turn = X;
// Translating from backend board to frontend board
var frontToBack = {};
frontToBack[EMPTY] = 0; frontToBack[X] = 1; frontToBack[O] = -1;
var backToFront = {};
backToFront[0] = EMPTY; backToFront[1] = X; backToFront[-1] = O;

////// Generic Play
// Checks to make sure players have been chosen
var checkPlayers = function () {
    if (!players[X] || !players[O]) {
        alert("please choose a player for X and also for O");
        return false;
    }
    return true;
};

// Erases the board and makes it X's turn
var newGame = function () {
    if (!checkPlayers()) return;

    turn = X;
    for (var i = 0; i < SQUARES.length; i += 1) {
        SQUARES[i].firstChild.nodeValue = EMPTY;
    }
    if (players[turn] !== HUMAN) {
        aiPlay();
    }
};

// Returns whether the game is won, and by whom
var win = function () {
    var i, j;
    var is_win, winner;
    for (i = 0; i < WINS.length; i += 1) {
        is_win = ((SQUARES[WINS[i][0]].firstChild.nodeValue === SQUARES[WINS[i][1]].firstChild.nodeValue) && 
                  (SQUARES[WINS[i][1]].firstChild.nodeValue === SQUARES[WINS[i][2]].firstChild.nodeValue) &&
                  (SQUARES[WINS[i][0]].firstChild.nodeValue !== EMPTY));
        if (is_win) {
            return SQUARES[WINS[i][0]].firstChild.nodeValue;
        }
    }
    return false;
};

// Returns if the board is full
var cat = function () {
    var i;
    for (i = 0; i < SQUARES.length; i += 1) {
        if (SQUARES[i].firstChild.nodeValue === EMPTY) {
            return false;
        }
    }
    return true;
};

// Handle the switching of turns
var switchTurn = function () {
    if (!checkPlayers()) return;

    var winner = win();
    var full = cat();
    // if there is a winner, end the game with an alert
    if (winner) {
        alert(winner + " won!");
        turn = null;
    // if there is a cat, end the game with an alert
    } else if (full) {
        alert("cat!");
        turn = null;
    // else continue play with the next player
    } else {
        turn = turn === X ? O : X;
        if (players[turn] !== HUMAN) {
            aiPlay();
        }
    }
};







/////// Handle the various types of players
// Move for the computer
var computerMove = function(play) {
    if (SQUARES[play].firstChild.nodeValue === EMPTY) {
        SQUARES[play].firstChild.nodeValue = turn;
        switchTurn();
    }
};

// Get computer move
var fetchComputerMove = function(toBackend) {
    var play;
    $.ajax({
        type: "POST",
        url: "/api/tictactoe/",
        data: JSON.stringify(toBackend),
        dataType: "json",
        success: function (data) {
            console.log("ajaxed for ai move");
            play = data["play"];
            computerMove(play);
        },
        error: function (e) {
            alert("Having trouble with the backend ai... try again later")
        }
    }); 
    return play;   
};

// Spoof computer move
var spoofComputerMove = function(toBackend) {
    for (var i = 0; i < SQUARES.length; i++){
        if (SQUARES.firstChild.nodeValue === EMPTY) {
            return i;
        }
    }
};

// Computer play
var aiPlay = function() {
    // Contact the backend to get a move
    // Translate the board into a backend readable format
    var board = SQUARES.map(function (x) { return frontToBack[x.firstChild.nodeValue]; })
    // Translate the player
    var player = frontToBack[turn];
    // Get the engine
    var engine = players[turn];

    var toBackend = {
        "engine" : engine,
        "state" : {
            "board" : board,
            "player" : player
        }
    };

    fetchComputerMove(toBackend);
};

// Human play
var humanPlay = function () {
    if ((this.firstChild.nodeValue === EMPTY) &&
        ((turn === X && players[X] === HUMAN) ||
         (turn === O && players[O] === HUMAN)
        )
       ) {
        this.firstChild.nodeValue = turn;
        switchTurn();
    }
};   






////// Page setup functions
// Get engine list
var fetchEngineList = function() {
    var engines;
    $.ajax({
        type: "POST",
        url: "/api/tictactoe/",
        data: JSON.stringify({ "help" : 1 }),
        dataType: "json",
        success: function (data) {
            console.log("ajaxed to get available engines");
            engines = data["available_engines"];
            fillEngineLists(engines);
            // The player types
            players = {X : document.getElementById("xplayer").value,
                       O : document.getElementById("oplayer").value};
        },
        error: function (e) {
            alert("Having trouble with the backend... try again later");
            fillEngineLists([]);
            // The player types
            players = {X : document.getElementById("xplayer").value,
                       O : document.getElementById("oplayer").value};
        }
    });
};

var spoofEngineList = function() {
    return ["fake_ai", "another_fake_ai"];
};

// Add a option to a dropdown menu
var addOption = function (option, parent, isDefault) {
    var optionElement = document.createElement('option');
    optionElement.text = option;
    if (isDefault) {
        optionElement.selected = 'selected';
        optionElement.value = "";
    } else {
        optionElement.value = option;
    }
    parent.appendChild(optionElement);
};

// Add a drop down menu to the given parent element.
var addSelect = function (options, parent, selectId, defaultOption, onChange) {
    var newDiv = document.createElement('div');
    var newSelect = document.createElement('select');
    newSelect.id = selectId;
    newSelect.onchange = onChange;
    addOption(defaultOption, newSelect, true);
    options.forEach(function(x) { addOption(x, newSelect, false); });
    newDiv.appendChild(newSelect);
    parent.appendChild(newDiv);
};

// Fill drop downs
var fillEngineLists = function(engineList) {
    engineList.push(HUMAN);
    var selectContainer = document.getElementById("select_container");
    addSelect(engineList, selectContainer, "xplayer", "Choose X player:", function () { players[X] = this.value; });
    addSelect(engineList, selectContainer, "oplayer", "Choose O player:", function () { players[O] = this.value; });   
};





////// Actually setup the page
////// Shit that needs to happen after the page loads
window.onload = function() {
    // Fill in the engine lists
    fetchEngineList();

    // Add human play to the cells
    var cells = document.getElementsByClassName("ttt_cell");
    for (var i = 0; i < cells.length; i++) {
        cells[i].onclick = humanPlay;
    }

    // Get the game board in a place we can use it.
    SQUARES = [document.getElementById("ttt_cell_0"),
                   document.getElementById("ttt_cell_1"), 
                   document.getElementById("ttt_cell_2"), 
                   document.getElementById("ttt_cell_3"), 
                   document.getElementById("ttt_cell_4"), 
                   document.getElementById("ttt_cell_5"), 
                   document.getElementById("ttt_cell_6"), 
                   document.getElementById("ttt_cell_7"), 
                   document.getElementById("ttt_cell_8"), 
                  ];
};

