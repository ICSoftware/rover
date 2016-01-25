'use strict';
window.fallingOutRecord = {};
window.unfinishedInstruction={};
window.fallingOutRecord.n=0;
window.gameFinished=false;
var checkIfFallingOutScent = function(robot) {
    if (!window.fallingOutRecord[robot.x+"_"+robot.y]) {
        return 1;
    } else{
        if (robot.o === window.fallingOutRecord[robot.x+"_"+robot.y].instruction) {
            return 0;
        } else {
            return 1;
        }
    }
};
window.onload = function () {
    var command =
        // '5 3 \n 1 1 e\n rfrfrfrf\n 3 2 N \n frrffllffrrfll\n 0 3 w\n LLFFFLFLFL'; this coordinate will put robot out of bound from beginning. so adjust to fix the board.
        '5 3 \n 1 1 e\n rfrfrfrf\n 3 2 N \n frrffllffrrfll\n 1 3 w\n LLFFFLFLFL';
    // this function parses the input string so that we have useful names/parameters
    // to define the playfield and the robots for subsequent steps
    var parseInput = function (input) {
        // task #1
        // replace the 'parsed' var below to be the string 'command' parsed into an object we can pass to genworld();
        // genworld expects an input object in the form { 'bounds': [3, 8], 'robos': [{x: 2, y: 1, o: 'W', command: 'rlrlff'}]}
        // where bounds represents the top right corner of the plane and each robos object represents the
        // x,y coordinates of a robot and o is a string representing their orientation. a sample object is provided below
        var inputArray = input.split("\n ");
        var boundArray=inputArray[0].split(" ");
        inputArray.shift();
        var robots = [];
        for (var i=0;i<inputArray.length;i+=2) {
            var robot = {};
            var robotCoordiate = inputArray[i].split(" ");
            robot.x = parseInt(robotCoordiate[0])-1;
            robot.y = parseInt(robotCoordiate[1])-1;
            robot.o = robotCoordiate[2].toUpperCase();
            robot.command = inputArray[i+1].toLowerCase();
            robots.push(robot);
        }
        var parsed = {
            bounds: boundArray,
            robos: robots
        };
        return parsed;
    };


    // this function replaces teh robos after they complete one instruction
    // from their commandset
    var tickRobos = function (robos) {
        var directions="NWSE";
        var remainingCommand = false;
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
        if (robos.length==0) {
            missionSummary();
            return;
        }
        for (var i=0;i<robos.length;i++) {
            var robot = robos[i];
            var command = robot.command.charAt(0);
            if (!!command) remainingCommand = true;
            var currentLocation = robot.x+"_"+robot.y;
            robot.command = robot.command.slice(1);
            if (command === "l" || command === "r") {//robot only turn, no falling risk
                if ((command ==="l" && robot.o === "E") || (command ==="r" && robot.o === "N")) {
                    robot.o = (robot.o === "E") ? "N" : "E";
                } else {
                    robot.o = directions[command === "l" ? directions.indexOf(robot.o) + 1 : directions.indexOf(robot.o) - 1];
                }
            } else { //robot moving forward
                if (!!command){
                    switch (robot.o) {
                        case "N":
                            robot.y-=checkIfFallingOutScent(robot);
                            break;
                        case "W":
                            robot.x-=checkIfFallingOutScent(robot);
                            break;
                        case "S":
                            robot.y+=checkIfFallingOutScent(robot);
                            break;
                        case "E":
                            robot.x+=checkIfFallingOutScent(robot);
                            break;
                        default:
                    }
                }
            }
            if (robot.x<0 || robot.x>gameWorld[0].length-1 || robot.y<0 || robot.y>gameWorld.length-1) {//falling out
                robos.splice(i, 1);
                i--;
                window.fallingOutRecord[currentLocation] = {"instruction":robot.o, "remaining":robot.command};
                window.fallingOutRecord.n++;
            } else {
                robos[i] = robot;
            }

        }
        if (!remainingCommand) missionSummary(robos);
        // !== write robot logic here ==!

        //leave the below line in place
        placeRobos(robos);
    };

    // mission summary function
    var missionSummary = function (robos) {
        if (!window.gameFinished) {
            var para = document.createElement("P");
            var t = document.createTextNode("There are "+robos.length+" robots left:");
            para.appendChild(t);
            document.body.appendChild(para);
            var robot;
            for (var i=0; i<robos.length;i++) {
                robot = robos[i];
                para = document.createElement("P");
                t = document.createTextNode("Position: "+ robot.x+", "+robot.y+" | Orientation: "+robot.o);
                para.appendChild(t);
                document.body.appendChild(para);
            }

            para = document.createElement("P");
            t = document.createTextNode("There are "+window.fallingOutRecord.n+" robots dead:");
            para.appendChild(t);
            document.body.appendChild(para);
            var location;
            var x;
            var y;
            for (location in window.fallingOutRecord) {
                if (location !== "n") {
                    x=location.split("_")[0];
                    y=location.split("_")[1];
                    para = document.createElement("P");
                    t = document.createTextNode(
                        "Position: " + x + ", " + y +
                        " | Orientation: " + window.fallingOutRecord[location].instruction +
                        " | Unexecuted instructions: " + window.fallingOutRecord[location].remaining);
                    para.appendChild(t);
                    document.body.appendChild(para);
                }
            }
        }
        window.gameFinished=true;
        // task #3
        // summarize the mission and inject the results into the DOM elements referenced in readme.md
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
        }, 100);
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
