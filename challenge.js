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
        robo.o = _.lowerCase(chunk[0][2]);
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
    
    var tickRobos = function (gameState) {
        console.log('tickrobos');
        
        for (var i=0; i<gameState.robos.length; i++) {
            var robo = gameState.robos[i];
            if (robo == undefined) {
                continue;
            }
            if (robo.scentDetected(gameState.scents) && robo.command[0]=='f') {
                robo.popCommand();
            } else {
                robo.doCommand();
                if (gameState.roboOutOfBounds(robo)) {
                    gameState.addScent(robo);
                    gameState.removeRobo(i);
                }
            }
        }

        missionSummary(gameState);

    };

    var missionSummary = function (gameState) {

        var robosString = '';
        var lostRobosString = '';

        _.forEach(gameState.robos, function(robo) {
            robosString+=robo.toString() + '';
        });

        _.forEach(gameState.lostRobos, function(robo) {
            lostRobosString+=robo.toString() + ' ';
        });

        window.document.getElementById('robots').innerHTML = robosString;
        window.document.getElementById('lostRobots').innerHTML = lostRobosString;

    };

    window.rover = {
        parse: parseInput,
        tick: tickRobos,
        summary: missionSummary,
        command: command
    };
};

