
(function () {

    ////// Constants
    // The board
    var SQUARES = [document.getElementById("ttt_cell_0"),
                   document.getElementById("ttt_cell_1"), 
                   document.getElementById("ttt_cell_2"), 
                   document.getElementById("ttt_cell_3"), 
                   document.getElementById("ttt_cell_4"), 
                   document.getElementById("ttt_cell_5"), 
                   document.getElementById("ttt_cell_6"), 
                   document.getElementById("ttt_cell_7"), 
                   document.getElementById("ttt_cell_8"), 
                  ]
    // Board markings
    var EMPTY = "\xA0"
    var X = "X"
    var O = "O"
    // The board indices where we have a win
    var WINS = [[0,1,2],[3,4,5],[6,7,8],
                [0,3,6],[1,4,7],[2,5,8],
                [0,4,8],[2,4,6]]
    // String indicating human player (as opposed to the plethora of possible ais)
    var HUMAN = "human"

    ////// Globals
    // Whose turn is it right now
    var turn = X
    // Translating from backend board to frontend board
    var frontToBack = {EMPTY:0, X:1, O:-1}
    var backToFront = {0:EMPTY, 1:X, -1:O}




    ////// Generic Play
    // Erases the board and makes it X's turn
    newGame = function () {
        var i;
        
        turn = X;
        for (i = 0; i < SQUARES.length; i += 1) {
            SQUARES[i].firstChild.nodeValue = EMPTY;
        }
        if (players[turn] !== HUMAN) {
            aiPlay();
        }
    }

    // Returns whether the game is won, and by whom
    win = function () {
        var i, j;
        var is_win, winner;
        for (i = 0; i < wins.length; i += 1) {
            is_win = ((SQUARES[WINS[i][0]].firstChild.nodeValue === SQUARES[WINS[i][1]].firstChild.nodeValue) && 
                      (SQUARES[WINS[i][1]].firstChild.nodeValue === SQUARES[WINS[i][2]].firstChild.nodeValue) &&
                      (SQUARES[WINS[i][0]].firstChild.nodeValue !== EMPTY));
            if (is_win) {
                return SQUARES[WINS[i][0]].firstChild.nodeValue;
            }
        }
        return false;
    }

    // Returns if the board is full
    cat = function () {
        var i;
        for (i = 0; i < SQUARES.length; i += 1) {
            if (SQUARES[i].firstChild.nodeValue === EMPTY) {
                return false;
            }
        }
        return true;
    }

    // Handle the switching of turns
    switchTurn = function () {
        var winner = win()
        var full = cat()
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
    }







    /////// Handle the various types of players
    // Move for the computer
    computerMove = function(play) {
        if (SQUARES[i].firstChild.nodeValue === EMPTY) {
            SQUARES[i].firstChild.nodeValue = turn;
            switchTurn();
        }
    }

    // Get computer move
    getComputerMove = function(toBackend) {
        $.ajax({
            type: "POST",
            url: "/api/tictactoe/",
            data: toBackend,
            dataType: "json",
            success: function (data) {
                return data["play"];
            },
            error: function (e) {
                alert("Having trouble with the backend ai... try again later")
            }
        });    
    }

    // Spoof computer move
    spoofComputerMove = function(toBackend) {
        for (var i = 0; i < SQUARES.length; i++){
            if (SQUARES.firstChild.nodeValue === EMPTY) {
                return i;
            }
        }
    }

    // Computer play
    aiPlay = function() {
        // Contact the backend to get a move
        // Translate the board into a backend readable format
        var board = SQUARES.map(function (x) { return frontToBack[x.firstChild.nodeValue]; })
        // Translate the player
        var player = frontToBack[turn]
        // Get the engine
        var engine = players[turn]

        var toBackend = {
            "engine" : engine,
            "state" : {
                "board" : board,
                "player" : player
            }
        }

        play = spoofComputerMove(toBackend);
        computerMove(play);
    }

    // Human play
    humanPlay = function () {
        if ((this.firstChild.nodeValue === EMPTY) &&
            ((turn === X && xplayer === HUMAN) ||
             (turn === O && oplayer === HUMAN)
            )
           ) {
            this.firstChild.nodeValue = turn;
            switchTurn();
        }
    }    






    ////// Page setup functions
    // Get engine list
    getEngineList = function() {
        $.ajax({
            type: "POST",
            url: "/api/tictactoe/",
            data: { "help" : 1 },
            dataType: "json",
            success: function (data) {
                return data["available_engines"];
            },
            error: function (e) {
                alert("Having trouble with the backend... try again later")
            }
        });
    }

    spoofEngineList = function() {
        return ["fake_ai", "another_fake_ai"];
    }

    // Add a option to a dropdown menu
    addOption = function (option, parent, isDefault) {
        var optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.text = option;
        if (isDefault) {
            optionElement.selected = 'selected';
        }
        parent.appendChild(optionEleent);
    }

    // Add a drop down menu to the given parent element.
    addSelect = function (options, parent, selectId, defaultOption, onChange) {
        var newDiv = document.createElement('div');
        var newSelect = document.createElement('select');
        newSelect.id = selectId;
        newSelect.onchange = onChange;
        addOption(defaultOption, newSelect, true);
        options.forEach(function(x) { addOption(x, newSelect, false); });
        newDiv.appendChild(newSelect);
        parent.appendChild(newDiv);
    }

    // Fill drop downs
    fillEngineLists = function(engineList) {
        var selectContainer = document.getElementById("select_container");
        addSelect(availableEngines, selectContainer, "xplayer", HUMAN, function () { players[X] = this.value; });
        addSelect(availableEngines, selectContainer, "oplayer", HUMAN, function () { players[O] = this.value; });   
    }





    ////// Actually setup the page

    // Fill in the engine lists
    fillEngineLists(spoofEngineList());

    // Add human play to the cells
    document.getElementsByClassName("ttt_cell").forEach( function(x) { x.onclick = humanPlay; })

    // The player types
    var players = {X : document.getElementById("xplayer").value,
                   O : document.getElementById("oplayer").value}
});
