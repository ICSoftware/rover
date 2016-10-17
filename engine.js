'use strict';

// don't touch this at all.
/* globals _ */
if (!window) {
    window = {};
}
window.onload = function () {
    console.log('onload called');
    window.initGame();
    var canvas = document.getElementById('playfield')
        .getContext('2d'),
        width = document.getElementById('playfield')
        .width * 2,
        height = document.getElementById('playfield')
        .height * 2,
        fontSize = 18,
        gridText = [],
        gameWorld = [],
        gridText = [],
        gameWorld = [];
    canvas.font = 'bold ' + fontSize + 'px monospace';
    canvas.fillStyle = 'black';
    canvas.textAlign = 'center';
    var genworld = function (gameState, renderflag, world) {
        //build init world array
        gameWorld = [];
        var bounds = gameState.bounds,
            robos = gameState.robos;

        var row = [];
        for (var i = 0; i <= bounds[0]; i++) {
            row.push('.');
        }
        for (var i = 0; i <= bounds[1]; i++) {
            var test = [].concat(row);
            gameWorld.push(test);
        }
        var placeRobos = function (robos) {
            for (var i in robos) {
                var robo = robos[i];
                var activeRow = gameWorld[robo.y];
                if (activeRow) {
                    activeRow[robo.x] = robo.o;
                }
            }
        };
        gameState = window.rover.tick(gameState);
        gameState.robos = gameState.robos;
        placeRobos(gameState.robos);
        if (renderflag) {
            render(gameWorld, gameState.robos);
        }
        if (renderflag) {
            window.setTimeout(function () {
                var finished = false;
                _.each(gameState.robos, function (robo) {
                    if (robo.command.length !== 0 && finished === false) {
                        finished = true;
                    }
                });
                if (finished === false) {
                    window.rover.summary(gameState.robos);
                    runTests(gameWorld);
                } else {
                    genworld(gameState, true);
                }
            }, 124);
        }
        return gameWorld;
    };
    //render block
    var render = function (gameWorld) {
        console.log('render', gameWorld);
        canvas.clearRect(0, 0, width, height);
        for (var i = 0; i < gameWorld.length; i++) {
            var blob = gameWorld[i].join('');
            canvas.fillText(blob, 250, i * fontSize + fontSize);
        }
    };
    // test world state for succesful test
    var runTests = function (lastworld) {
        console.log('runtests: ');
        var successWorld = ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 's', '.', '.', '.', '.', '.', '.', '.', '.', '.'];
        if (!window.doneTrigger) {
            if (_.isEqual(_.flatten(lastworld), successWorld)) {
                document.getElementById('test')
                    .innerText =
                    'your business logic is correct, which means you beat task #1 and #2';
            } else {
                document.getElementById('test')
                    .innerText = 'your solution was incorrect';
            }

        } else {
            console.log('fire doneTrigger: ', successWorld, lastworld);
            window.doneTrigger(successWorld, _.flatten(lastworld));
        }
    };
    // wireup init functions for display
    var command = window.rover.parse(window.rover.command);
    var gameState = new GameState(command.robos, command.bounds);
    genworld(gameState, true);
};

//GameState class
function GameState(robos, bounds) {
    this.robos = _.map(robos, function(robo) {
        return new Robo(robo);
    });
    this.bounds = bounds;
    this.scents = {};
}

GameState.prototype.roboOutOfBounds = function(robo) {
    return (robo.x <= this.bounds[0] && robo.y <= this.bounds[1]);
};

GameState.prototype.addScent = function(robo) {
    this.scents[String(robo.x) + String(robo.y)] = true;
}

GameState.prototype.removeRobo = function(index) {
    this.robos = this.robos.splice(index, index+1);
}


//Global used in Robo.prototype.rotate
var BEARINGS = ['N', 'E', 'S', 'W'];


//Robo class
function Robo(robo) {
    this.x = robo.x;
    this.y = robo.y;
    this.o = robo.o;
    this.command = robo.command;
}

Robo.prototype.rotate = function(shift, bearing) {
    var index = BEARINGS.indexOf(bearing);
    var shifted = index + shift;
    return BEARINGS[((shifted%4)+4)%4]; //javascript mod returns negative numbers, need to get positive index
};

Robo.prototype.moveForward = function() {
    var coords = this.calculateForwardCoords();
    this.x = coords[0];
    this.y = coords[1];
};

Robo.prototype.calculateForwardCoords = function() {
    var coords = [];
    switch(this.o) {
    case 'N':
        coords[0] = this.x;
        coords[1] = this.y-1;
        return coords;
        break;
    case 'E':
        coords[0] = this.x-1;
        coords[1] = this.y;
        return coords;
        break;
    case 'S':
        coords[0] = this.x;
        coords[1] = this.y+1;
        return coords;
        break;
    case 'W':
        coords[0] = this.x+1;
        coords[1] = this.y;
        return coords;
        break;
    }
}

Robo.prototype.doCommand = function () {
    var command = this.command[0];
    switch(command) {
    case 'l':
        this.o = this.rotate(-1, this.o);
        break;
    case 'r':
        this.o = this.rotate(1, this.o);
        break;
    case 'f':
        this.moveForward();
        break;
    }

    this.popCommand()
};

Robo.prototype.popCommand = function () {
    this.command = this.command.slice(1);
}

Robo.prototype.scentDetected = function (scents) {
    var coords = this.calculateForwardCoords();
    var testCoords = String(coords[0]) + String(coords[1]);

    if (_.get(scents, testCoords)) {
        return true;
    } else {
        return false;
    }
}