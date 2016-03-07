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
		var actionMap = getActionMap();

		robos.forEach(function(bot,index,array) {
			if(bot.command.length === 0) return;

			var currentCommand = bot.command.substr(0,1);
			var actionItem = actionMap.filter(function(item) { // find not always supported
				return item.o === bot.o;
			})[0];

			bot.command = bot.command.substr(1);

			if(currentCommand !== 'f') {
				bot.o = actionItem[currentCommand];
			} else if(!isCommandInScents(bot)) {
				if(actionItem.moveAndCheckIfLost(bot)) {
					lostRobos.push(Object.create(bot)); // assign not always available
					array.splice(index,1);
				}
			}
		});

        //leave the below line in place
        placeRobos(robos);

		if(!summarized && (robos.length === 0 || robos.filter(function(i) { return i.command.length > 0; }).length === 0)) {
			summarized = missionSummary(robos);
		}

		///////////////
		function getActionMap() {
			return [{
				o: 'N',
				l: 'W',
				r: 'E',
				moveAndCheckIfLost: function(state) {
					state.y++;
					return isOutOfBounds(state.y,bounds[1]);
				}
			}, {
				o: 'S',
				l: 'E',
				r: 'W',
				moveAndCheckIfLost: function(state) {
					state.y--;
					return isOutOfBounds(state.y,bounds[1]);
				}
			}, {
				o: 'E',
				l: 'N',
				r: 'S',
				moveAndCheckIfLost: function(state) {
					state.x++;
					return isOutOfBounds(state.x,bounds[0]);
				}
			}, {
				o: 'W',
				l: 'S',
				r: 'N',
				moveAndCheckIfLost: function(state) {
					state.x--;
					return isOutOfBounds(state.x,bounds[0]);
				}
			}];
		}

		function isOutOfBounds(coordinateValue,boundsValue) {
			return coordinateValue < 0 || coordinateValue > boundsValue;
		}

		function isCommandInScents(state) {
			return lostRobos.filter(function(i) { // find not always supported
				return state.o === i.o && state.x === i.x && state.y === i.y;
			}).length > 0;
		}
    };
    // mission summary function
    var missionSummary = function (robos) {
        // task #3
        // summarize the mission and inject the results into the DOM elements referenced in readme.md
	var frag = document.createDocumentFragment();
	robos.forEach(function(i) {
		var li = document.createElement('li');
		var content = 'Position: ' + i.x + ', ' + i.y + ' | Orientation: ' + i.o;
		li.textContent = content;
		frag.appendChild(li);
	});

	document.getElementById('robots').appendChild(frag);

	frag = document.createDocumentFragment();
	lostRobos.forEach(function(i) {
		var li = document.createElement('li');
		var content = 'Position: ' + i.x + ', ' + i.y + ' | Orientation: ' + i.o;
		li.textContent = content + ' | ' + createKillerInstruction(i);
		frag.appendChild(li);
	});

	function createKillerInstruction(state) {
		var liveState = Object.create(state);
		switch(state.o){
			case 'N':
				liveState.y--;
				break;
			case 'S':
				liveState.y++;
				break;
			case 'E':
				liveState.x--;
				break;
			case 'W':
				liveState.x++;
		}
		return 'Killer Instruction: { ' +
			'Position: ' + liveState.x + ', ' + liveState.y + ' | Orientation: ' + liveState.o + ' | Command: f }';
	}

	document.getElementById('lostRobots').appendChild(frag);
	return true;
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
        gameWorld,
	bounds,
	lostRobos = [],
	summarized = false;

    canvas.font = 'bold ' + fontSize + 'px monospace';
    canvas.fillStyle = 'black';
    canvas.textAlign = 'center';
    var genworld = function (parsedCommand) {
        //build init world array
        gameWorld = [];
        bounds = parsedCommand.bounds;
        var robos = parsedCommand.robos;
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
