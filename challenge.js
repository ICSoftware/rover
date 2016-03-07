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
        var parsed = {};

		var splitInput = input.split('\n');

		//bounds
		parsed.bounds = splitInput
			.shift()
			.trim()
			.split(' ')
			.map(function(value) {
			  return Number.parseInt(value, 10);
			});

		//robos
		parsed.robos = [];
		splitInput.forEach(function(value,index) {
			if(index % 2 === 0) {
			  var splitValue = value.trim().split(' ');
			  parsed.robos.push({
				x: Number.parseInt(splitValue[0], 10),
				y: Number.parseInt(splitValue[1], 10),
				o: splitValue[2].toUpperCase(),
			  });
			} else {
			  parsed.robos[parsed.robos.length-1].command = value.trim().toLowerCase();
			}
		});

        return parsed;
    };
    // this function replaces teh robos after they complete one instruction
    // from their commandset
    var tickRobos = function (robos,bounds) {
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
		var actionMap = [{
			o: 'N',
			l: 'W',
			r: 'E',
			moveAndCheckInbounds: function(state) {
				if(isOutOfBounds(state.y + 1,bounds[1])) {
					return false;
				}

				state.y++;
				return true;
			}
		}, {
			o: 'S',
			l: 'E',
			r: 'W',
			moveAndCheckInbounds: function(state) {
				if(isOutOfBounds(state.y - 1,bounds[1])) {
					return false;
				}

				state.y--;
				return true;
			}
		}, {
			o: 'E',
			l: 'N',
			r: 'S',
			moveAndCheckInbounds: function(state) {
				if(isOutOfBounds(state.x + 1,bounds[0])) {
					return false;
				}

				state.x++;
				return true;
			}
		}, {
			o: 'W',
			l: 'S',
			r: 'N',
			moveAndCheckInbounds: function(state) {
				if(isOutOfBounds(state.x - 1,bounds[0])) {
					return false;
				}

				state.x--;
				return true;
			}
		}];

		function isOutOfBounds(coordinateValue,boundsValue) {
			return coordinateValue < 0 || coordinateValue > boundsValue;
		}

		function processCommands(state,scents) {
			var commands = state.command.split('');
			var actionItem = actionMap.find(function(item) {
				return item.o === state.o;
			});

			if(commands[0] === 'f') {
				if(!actionItem.moveAndCheckInbounds(state)) {
					delete state.command;
					return false;
				}
			} else {
				state.o = actionItem[commands[0]];
			}

			commands.shift();
			state.command = commands.join('');

			return state.command.length > 0;
		}

		robos.forEach(function(value,index,array) {
			var scents = array.filter(function(item) {
				return item.command === undefined;
			});

			while(processCommands(value,scents)) {}
		});

        //leave the below line in place
        placeRobos(robos);
    };
    // mission summary function
    var missionSummary = function (robos) {
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
        gameWorld;
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
        tickRobos(robos,bounds);
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
