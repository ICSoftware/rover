'use strict';
/* globals _, engine */
// stub window for serverside check
if (!window) {
    window = {};
};
window.initGame = function () {
    console.log('initgame');

    var command =
        '5 3 \n 1 1 s\n ffffff\n 2 1 w \n flfffffrrfffffff\n 0 3 w\n LLFFFLFLFL';
    
    var mapChunk = function(chunk) {
        var robo = {};
        robo.x = Number(chunk[0][0]);
        robo.y = Number(chunk[0][1]);
        robo.o = _.upperCase(chunk[0][2]);
        robo.command = _.lowerCase(chunk[1]);

        return robo;
    };
    
    var parseInput = function (input) {
        
        var tokens = input.replace(/ /g,'').split('\n');

        var bounds = _.map(tokens.shift().split(''), function(s) {
            return Number(s);
        });

        var robos = _.map(_.chunk(tokens, 2), mapChunk);

        var parsed = {bounds: bounds, robos: robos};

        return parsed;
    };

    // this function replaces the robos after they complete one instruction
    // from their commandset
    
    var tickRobos = function (gameState) {
        console.log('tickrobos');

        console.log(gameState);
        
        for (var i = gameState.robos.length-1; i--;) {
            var robo = gameState.robos[i];
            if (robo == undefined) { //we may have removed a robo during the loop
                continue;
            }
            if (robo.scentDetected(gameState.scents)) {
                robo.popCommand();
            } else {
                robo.doCommand();
                if (gameState.roboOutOfBounds(robo)) {
                    gameState.addScent(robo);
                    gameState.removeRobo(i);
                }
            }
        }

        return gameState;
    };
    // mission summary function
    var missionSummary = function (robos) {
        //
        // task #3
        //
        // summarize the mission and inject the results into the DOM elements referenced in readme.md
        //
        return;
    };

    // leave this alone please
    window.rover = {
        parse: parseInput,
        tick: tickRobos,
        summary: missionSummary,
        command: command
    };
};

