'use strict';
window.onload = function () {
    var command =
        '5 3 \n 1 1 e\n rfrfrfrf\n 3 2 N \n frrffllffrrfll\n 0 3 w\n LLFFFLFLFL';
    // this function parses the input string so that we have useful names/parameters
    // to define the playfield and the robots for subsequent steps
    var playBounds = null;
    var deadBots = [];
    var summerized = false;
    var parseInput = function (input) {
        // task #1 
        // replace the 'parsed' var below to be the string 'command' parsed into an object we can pass to genworld();
        // genworld expects an input object in the form { 'bounds': [3, 8], 'robos': [{x: 2, y: 1, o: 'W', command: 'rlrlff'}]}
        // where bounds represents the top right corner of the plane and each robos object represents the
        // x,y coordinates of a robot and o is a string representing their orientation. a sample object is provided below
        var sections = input.split('\n');
        var bounds = sections[0].trim().split(' ');
        
        var robots = [];
        for (var i = 1; i < sections.length - 1; i += 2) {
            var pos = sections[i].trim().split(' ');
            robots.push({
                x: parseInt(pos[0]),
                y: parseInt(pos[1]),
                o: pos[2].trim().toLowerCase(),
                command: sections[i + 1].trim().toLowerCase()
            });
        };

        var parsed = {
            bounds: [
                parseInt(bounds[0]),
                parseInt(bounds[1])
            ],
            robos: robots
        };
        playBounds = parsed.bounds;
        return parsed;
    };
    // this function replaces teh robos after they complete one instruction
    // from their commandset
    var tickRobos = function (robos) {
        // task #2
        // in this function, write business logic to move robots around the playfield
        // the 'robos' input is an array of objects; each object has 4 parameters.
        // This function needs to edit each robot in the array so that its x/y coordinates
        // and orientation parameters match the robot state after 1 command has been completed. 
        // Also, you need to remove the command the robot just completed from the command list.
        // example input:
        // robos[0] = {x: 2, y: 2, o: 'N', command: 'frlrlrl'}
        //                   |- becomes -|
        // robos[0] = {x: 2, y: 1, o: 'N', command: 'rlrlrl'} 
        // if a robot leaves the bounds of the playfield, it should be removed from the robos
        // array. It should leave a 'scent' in it's place. If another robot–for the duration
        // of its commandset–encounters this 'scent', it should refuse any commands that would
        // cause it to leave the playfield.

        // !== write robot logic here ==!
        if(done(robos)) {
            if(!summerized) missionSummary(robos);
            summerized = true;
            return;
        }

        for (var i = 0; i < robos.length; i++) {
            var change = robos[i].command.charAt(0);
            if (change === '') continue;

            robos[i].command = robos[i].command.substring(1);
            robos[i] = getOrientation(robos[i], change);
            robos[i] = getPosition(robos[i], change);

            if(robos[i].killed) {
                robos.splice(i, 1);
            }
        };

        function getOrientation(robo, change) {
            if(change === 'f') return robo;

            switch(robo.o) {
            case 'n':
                if(change == 'r') {
                    robo.o = 'e';
                } else {
                    robo.o = 'w';
                }
                break;
            case 'e':
                if(change == 'r') {
                    robo.o = 's';
                } else {
                    robo.o = 'n';
                }
                break;
            case 's':
                if(change == 'r') {
                    robo.o = 'w';
                } else {
                    robo.o = 'e';
                }
                break;
            case 'w':
                if(change == 'r') {
                    robo.o = 'n';
                } else {
                    robo.o = 's';
                }
                break;
            }

            return robo;
        }

        function getPosition(robo, change) {
            if(change !== 'f') return robo;
            
            var x = robo.x;
            var y = robo.y;
            var scent = hasScent(x, y);

            switch(robo.o) {
            case 'n':
                y += 1;
                break;
            case 'e':
                x += 1;
                break;
            case 's':
                y -= 1;
                break;
            case 'w':
                x -= 1;
                break;
            }

            if((x > playBounds[0] || y > playBounds[1] || x < 0 || y < 0) && !scent) {
                deadBots.push({
                    bot: robo,
                    cause_of_death: change,
                    deathPos: {
                        x: x,
                        y: y
                    }
                });
                robo.killed = true;
            } else {
                robo.x = x;
                robo.y = y;
            }

            return robo;
        }

        function hasScent(x,y) {
            for (var i = 0; i < deadBots.length; i++) {
                if(deadBots[i].bot.x === x && deadBots[i].bot.y === y) {
                    return true;
                }
            };
            return false;
        }

        function done(robos) {
            var done = true;
            for (var i = 0; i < robos.length; i++) {
                if(robos[i].command !== '') done = false;
            };
            return done;
        }

        //leave the below line in place
        placeRobos(robos);
    };
    // mission summary function
    var missionSummary = function (robos) {
        // task #3
        // summarize the mission and inject the results into the DOM elements referenced in readme.md
        var robots = document.getElementById('robots');
        for (var i = 0; i < robos.length; i++) {
            var li = document.createElement('li');
            var text = document.createTextNode('Position: ' + robos[i].x + ',' + robos[i].y + ' | Orientation: ' + robos[i].o);
            li.appendChild(text);
            robots.appendChild(li);
        };
        
        var lostRobots = document.getElementById('lostRobots');
        for (var i = 0; i < deadBots.length; i++) {
            var li = document.createElement('li');
            var text = document.createTextNode('Dead Bot - Last Good Position: ' + deadBots[i].bot.x + ',' + deadBots[i].bot.y + ' | Orientation: ' + deadBots[i].bot.o
                + ' | Commands Left: ' + deadBots[i].bot.command + ' | Last Instruction: ' + deadBots[i].cause_of_death);
            li.appendChild(text);
            lostRobots.appendChild(li);
        };
    };
    // ~~~~~~!!!! please do not edit any code below this comment !!!!!!~~~~~~~;
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
    var genworld = function (parsedCommand) {
        //build init world array
        gameWorld = [];
        var bounds = parsedCommand.bounds,
            robos = parsedCommand.robos;
        var row = [];
        for (var i = 0; i < bounds[0]; i++) {
            row.push('.');
        }
        for (var i = 0; i < bounds[1]; i++) {
            var test = [].concat(row);
            gameWorld.push(test);
        }
        placeRobos(parsedCommand.robos);
        render(gameWorld, parsedCommand.robos);
        tickRobos(robos);
        window.setTimeout(function () {
            genworld(parsedCommand);
        }, 1000);
    };
    var placeRobos = function (robos) {
        for (var i in robos) {
            var robo = robos[i];
            var activeRow = gameWorld[robo.y];
            if (activeRow) {
                activeRow[robo.x] = robo.o;
            }
        }
    };
    //render block
    var render = function (gameWorld, robos) {
        canvas.clearRect(0, 0, width, height);
        for (var i = 0; i < gameWorld.length; i++) {
            var blob = gameWorld[i].join('');
            canvas.fillText(blob, 250, i * fontSize + fontSize);
        }
    };
    // wireup init functions for display
    genworld(parseInput(command));
};

