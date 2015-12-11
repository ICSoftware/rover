'use strict';
window.onload = function () {
    var command =
        '5 3 \n 1 1 e\n rfrfrfrf\n 3 2 N \n frrffllffrrfll\n 0 3 w\n LLFFFLFLFL';
	var bounds = new Array(),
		scentedPos = new Array(),
		fallenRobots = new Array();
	var orn, 
		validMoves = [{move: 'L', rotate: -90}, {move:'R', rotate: 90}, {move: 'F', rotate: 0}], // valid moves, add new move types here, e.g. 'B'
		orientations = [{name: 'N', value: 0}, {name: 'E', value: 90}, {name: 'S', value: 180}, {name: 'W', value: 270}];
		
    // this function parses the input string so that we have useful names/parameters
    // to define the playfield and the robots for subsequent steps
    var parseInput = function (input) {
        // task #1 
        // replace the 'parsed' var below to be the string 'command' parsed into an object we can pass to genworld();
        // genworld expects an input object in the form { 'bounds': [3, 8], 'robos': [{x: 2, y: 1, o: 'W', command: 'rlrlff'}]}
        // where bounds represents the top right corner of the plane and each robos object represents the
        // x,y coordinates of a robot and o is a string representing their orientation. a sample object is provided below
		var cmdArray = input.split('\n');
	
		bounds = cmdArray.shift().trim().split(' ');
		var robots = new Array(),
			cmdLine = new Array();
		var x,y,o, cmd = '';
		
		//ensuring even number of lines (2 per robot)
		if(cmdArray.length % 2) {
			alert('invalid number of command');
			return;
		}
		
		while(cmdArray.length) {
			cmdLine = cmdArray.shift().trim().split(' ');
			
			//ensure that first line has all 3 parts: x, y, o
			if(cmdLine.length < 3) {
				alert('invalid command: ' + cmdLine);
				break;
			}
			x = parseInt(cmdLine[0]);
			y = parseInt(cmdLine[1]);
			o = cmdLine[2];
			cmd = cmdArray.shift().trim();
			robots.push({'x':x, 'y': y, 'o': o, 'command': cmd});
		}
		
        return {'bounds':bounds, 'robos': robots};
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
        // robos[0] = {x: 2, y: 3, o: 'N', command: 'rlrlrl'} 
        // if a robot leaves the bounds of the playfield, it should be removed from the robos
        // array. It should leave a 'scent' in it's place. If another robot–for the duration
        // of its commandset–encounters this 'scent', it should refuse any commands that would
        // cause it to leave the playfield.

        // !== write robot logic here ==!
		var cmdDone = false; 
		robos.forEach(function(robo, index) {
			if(!robo.command.length) {
				cmdDone = true;
				return;
			} else {
				cmdDone = false;
			}
			var cmd = robo.command.slice(0,1).toUpperCase();
			var coorObj = {x:robo.x, y:robo.y};
			var orntObj = orientations.find(function(obj){
				return obj.name === robo.o.toUpperCase();
			});
			var moveObj = validMoves.find(function(obj){
				return obj.move === cmd.toUpperCase();
			});
			var newOrntObj = orientations.find(function(obj){
				//if value is more than 270 (orientation 'W', then moving right, set to value 0 to 'N')
				// else add values to determine new orientation
				var newVal = (orntObj.value + moveObj.rotate) > 270 ? 0 : orntObj.value + moveObj.rotate;
				return obj.value === newVal;
			});
			
			robo.o = newOrntObj.name;	
			
			robo.command = robo.command.substring(1);
			
			switch(robo.o.toUpperCase()) {
				case 'N':
					coorObj.y +=1;
					robo.y = scentedPos.indexOf(coorObj) > -1 ? coorObj.y : robo.y;	
				break;
				case 'S':
					coorObj.y -=1;
					robo.y = scentedPos.indexOf(coorObj) > -1 ? coorObj.y : robo.y;
				break;
				//ignoring L and R since they don't need movement, only orientation is changed
			}
			// if new coordinates fall outside of boundry by either x or y, remove robot 
			// and store coordinates in the scented positions array, and store robot in the fallenRobots array
			if(coorObj.y > bounds[1] || coorObj.y < 0 || coorObj.x > bounds[0] || coorObj.x < 0) {
				robo.killer = robo.command.substring(0,1).toUpperCase();
				fallenRobots.push(robo);
				scentedPos.push(coorObj);
				robos.splice(index, 1);				
			}
		});
		
		//missionSummary only if all commands are done or all robots have fallen
		if(!robos.length || cmdDone) {
			missionSummary(robos);
		}

        //leave the below line in place
        placeRobos(robos);
    };
    // mission summary function
    var missionSummary = function (robos) {
        // task #3
        // summarize the mission and inject the results into the DOM elements referenced in readme.md
		if(document.getElementById('robots').childElementCount != robos.length) {
			robos.forEach(function(robot){
				//Position: 3, 5 | Orientation: W
				var node = document.createElement("LI");
				var textnode = document.createTextNode("Position: " + robot.x + ", " + robot.y + " | " + "Orientation: " + robot.o);         // Create a text node
				node.appendChild(textnode);
				document.getElementById('robots').appendChild(node);
			});
		}
		
		if(document.getElementById('lostRobots').childElementCount != fallenRobots.length) {
			fallenRobots.forEach(function(robot){
				var node = document.createElement("LI");
				var textnode = document.createTextNode("Position: " + robot.x + ", " + robot.y + " | Orientation: " + robot.o + " | Unexecuted Commands: " + robot.command + " | Killer Move: " + robot.killer);         // Create a text node
				node.appendChild(textnode);
				document.getElementById('lostRobots').appendChild(node);
			});
		}
		
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

