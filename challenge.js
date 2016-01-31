'use strict';
window.onload = function () {
    var command =
        '5 3 \n 1 1 e\n rfrfrfrf\n 3 2 N \n frrffllffrrfll\n 0 3 w\n LLFFFLFLFL';
    // this function parses the input string so that we have useful names/parameters
    // to define the playfield and the robots for subsequent steps
    var parseInput = function (input) {
        // task #1
        // replace the 'parsed' var below to be the string 'command' parsed into an object we can pass to genworld();
        // genworld expects an input object in the form { 'bounds': [3, 8], 'robos': [{x: 2, y: 1, o: 'W', command: 'rlrlff'}]}
        // where bounds represents the top right corner of the plane and each robos object represents the
        // x,y coordinates of a robot and o is a string representing their orientation. a sample object is provided below
        // var parsed = {
        //     bounds: [20, 20],
        //     robos: [{
        //         x: 2,
        //         y: 1,
        //         o: 'W',
        //         command: 'rlrlrff'
        //     }, {
        //         x: 12,
        //         y: 10,
        //         o: 'E',
        //         command: 'fffffffffff'
        //     }, {
        //         x: 18,
        //         y: 8,
        //         o: 'N',
        //         command: 'frlrlrlr'
        //     }]
        // };

        /****** Jon's Code Start *****/
        var parsed = {};

        // makes string in to numbers
        function stringToNumber(s) {
            return s.split(' ').map(function(e) {
                return Number(e);
            });
        }

        // formats bounds data
        parsed.bounds = command.split('\n').filter(function(e,i) {
            if (i === 0) return e;
        }).map(function(line, i) {
            line = line.trim();
            return stringToNumber(line);
        }).reduce(function(obj, line) {
            return obj;
        });

        // formats robos data
        function formattedRobos() {
            // build robos obj
            function buildRobosObj(e) {
                var parts = e.split(' ');
                return {
                    x: Number(parts[0]),
                    y:  Number(parts[1]),
                    o: parts[2].toUpperCase(),
                    command: parts[3].toLowerCase()
                };
            }

            // raw robos to combined lines, in array
            var rawRobos = command.split('\n').filter(function(e,i) {
                if (i > 0) return e;
            }).map(function(line, i, a) {
                if (i % 2 === 0) {
                    line = line.trim()+' '+a[i+1].trim();
                    return line;
                }
                return null;
            });

            // filter array
            var editedRobos = rawRobos.filter(function(e) {
                if (e !== null) return e.trim();
            }).map(function(e) {
                return buildRobosObj(e);
            });

            return editedRobos;
        }

        parsed.robos = formattedRobos();

        // add bounds to global to use in tickRobos function
        window.robosMax = parsed.bounds;

        return parsed;
        /****** Jon's Code End *****/
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


        /****** Jon's Code Start *****/

        // X = left/right
        // Y = up/down

        var maxX = window.robosMax[0],
            maxY = window.robosMax[1],
            direction = ['N', 'E', 'S', 'W'];

        window.lostRobos = window.lostRobos || [];
        window.scent = window.scent || [];

        // update orientation
        function updateOrientation(command, curOrient, x, y) {
            // moving forward
            if (command[0] === 'f') {
                // check orientation, move + 1 that way

                var xTemp = x,
                    yTemp = y;

                switch (curOrient) {
                    case 'N':
                    yTemp = y + 1;
                        break;
                    case 'E':
                    xTemp = x + 1;
                        break;
                    case 'S':
                    yTemp = y - 1;
                        break;
                    case 'W':
                    xTemp = x - 1;
                        break;
                }

                // check if off grid
                function offGridCheck(x,y) {
                    if ((x >= 0 && y >= 0) &&
                        (x <= maxX && y <= maxY)) {
                        return true;
                    }
                    return false;
                }

                var gCheck = offGridCheck(xTemp, yTemp);
                if (gCheck) {
                    //return updated info
                    return {
                        x: xTemp,
                        y: yTemp,
                        o: curOrient,
                        command: command.substr(1)
                    };
                } else {
                    // OFF GRID
                    leaveScent(x,y);
                    lostRobosPos(xTemp,yTemp);

                    // remove obj commands, it's dead
                    return {
                        finalX: x,
                        finalY: y,
                        x: xTemp,
                        y: yTemp,
                        o: curOrient,
                        command: '',
                        offGrid: true,
                        remainingCommands: command
                    };
                }
            }

            // if moving right or left
            if (command[0] === 'r' || command[0] === 'l') {
                if (command[0] === 'r') var move = +1;
                if (command[0] === 'l') var move = -1;

                // update orientation direction
                function getNewOrientation(move, curOrient) {
                    var dirVal = direction.indexOf(curOrient) + (move);

                    // adjust for facing north
                    if (dirVal === 4) dirVal = 0;
                    // adjust for facing west
                    if (dirVal === -1) dirVal = 3;

                    return direction[dirVal];
                };

                var newOrientation = getNewOrientation(move, curOrient);

                //return updated info
                return {
                    x: x,
                    y: y,
                    o: newOrientation,
                    command: command.substr(1)
                };
            }
        }

        // list of positions of lost robos
        function lostRobosPos(x,y) {
            window.lostRobos.push([x,y]);
        }

        // checks lost robos
        function checkLostRobos(x,y) {
            var rCheck = window.lostRobos.find(function(item) {
                if (item.toString() === [x,y].toString());
            })

            if (rCheck === undefined) return false;
            return true;
        }

        // adds position to scent array
        function leaveScent(x,y) {
            var sCheck = window.scent.find(function(e) {
                if (e.toString() !== [x,y].toString());
            });

            if (sCheck == undefined) {
                window.scent.push([x, y]);
            }
        }

        // checks the scent
        function checkScent(x,y,command,o) {
            var isTrue = window.scent.find(function(elem) {
                if (elem.toString() === [x,y].toString()) {
                    // moving forward, might go off grid
                    if (command[0] === 'f') {

                        var xTemp = x,
                            yTemp = y;

                        switch (o) {
                            case 'N':
                            yTemp = y + 1;
                                break;
                            case 'E':
                            xTemp = x + 1;
                                break;
                            case 'S':
                            yTemp = y - 1;
                                break;
                            case 'W':
                            xTemp = x - 1;
                                break;
                        }

                        if (checkLostRobos(xTemp, yTemp)) {
                            return true;
                        }

                        return null;
                    }
                    return null;
                };
                return null;
            });

            if (isTrue) return false;
            return true;
        }

        // runs through one move
        function oneMove(e) {
            var okToMove = checkScent(e.x, e.y, e.command, e.o);

            if (okToMove) {
                if (e.command[0]) {
                    e = updateOrientation(e.command, e.o, e.x, e.y);
                    // return updated params
                    return e;
                } else {
                    // no more commands - it's done
                    return e;
                }
            } else {
                // remove command that would push robo off grid
                return e = {
                    x: e.x,
                    y: e.y,
                    o: e.o,
                    command: e.command.substr(1)
                };
            }
        }

        // add all call stack, get length, return if zero
        function totalRobosCallStack() {
            var totalCallStack = robos.map(function(c,i,a) {
                return c.command;
            });

            if (totalCallStack.join('').length > 0) {
                return false
            };
            return true;
        }

        // for loop to run each robo
        for (var i = 0; i < robos.length; i++) {
            robos[i] = oneMove(robos[i]);
        }

        // call missionSummary when longest original command completes its command stack or all robots have left the playfield

        // checks if call stack is empty
        if (totalRobosCallStack()) {
            window.counter = window.counter || 0;
            if (window.counter === 0) {
                missionSummary(robos);
            }
            window.counter++;
        }
        /****** Jon's Code End *****/

        //leave the below line in place
        placeRobos(robos);
    };
    // mission summary function
    var missionSummary = function (robos) {
        // task #3
        // summarize the mission and inject the results into the DOM elements referenced in readme.md

        /****** Jon's Code Start *****/
        var survivingRobotsElem = document.getElementById('robots'),
            lostRobotsElem = document.getElementById('lostRobots');

        // list of surviving robots
        var survivingRobotsList = robos.filter(function(robo) {
            if (!robo.hasOwnProperty('offGrid')) return robo;
        });

        // list of lost robots
        var lostRobotsList = robos.filter(function(robo) {
            if (robo.hasOwnProperty('offGrid')) return robo;
        });

        // builds new li
        function newLi(s) {
            var li = document.createElement('li');
            li.innerHTML = s;
            return li;
        }

        // adds elements to dom
        function addToDom(child, parent) {
            parent.appendChild(child);
        }

        // adds surviving robos to li
        survivingRobotsList.map(function(robo) {
            var liMessage = [];
            liMessage[0] = 'Position: ';
            liMessage[1] = robo.x;
            liMessage[2] = ', ';
            liMessage[3] = robo.y;
            liMessage[4] = ' | Orientation: ';
            liMessage[5] = robo.o;

            var li = newLi(liMessage.join(''));
            addToDom(li, survivingRobotsElem);
        });

        // add lost robos to li
        lostRobotsList.map(function(robo) {
            var liMessage = [];
            liMessage[0] = '(Final Live) Position: ';
            liMessage[1] = robo.finalX;
            liMessage[2] = ', ';
            liMessage[3] = robo.finalX;
            liMessage[4] = ' | Orientation: ';
            liMessage[5] = robo.o;
            liMessage[6] = ' | Unexecuted Instructions: ';
            liMessage[7] = robo.remainingCommands;
            liMessage[8] = ' | Killed Moving To: ';
            liMessage[9] = robo.x;
            liMessage[10] = ', ';
            liMessage[11] = robo.y;

            var li = newLi(liMessage.join(''));
            addToDom(li, lostRobotsElem);
        });
        /****** Jon's Code End *****/
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
