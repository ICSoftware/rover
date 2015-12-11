'use strict';
window.onload = function () {
    var command =
        '10 5 \n 1 1 e\n rfrfffffffrfrf\n 3 2 N \n frrffllllfffffffffrrfll\n 0 3 w\n LLFFFfLFLFL';
    // this function parses the input string so that we have useful names/parameters
    // to define the playfield and the robots for subsequent steps

    const DEAD = "!";
    var bounds = [],
        fallen = [];

    var parseInput = function (input) {
        // task #1 
        // replace the 'parsed' var below to be the string 'command' parsed into an object we can pass to genworld();
        // genworld expects an input object in the form { 'bounds': [3, 8], 'robos': [{x: 2, y: 1, o: 'W', command: 'rlrlff'}]}
        // where bounds represents the top right corner of the plane and each robos object represents the
        // x,y coordinates of a robot and o is a string representing their orientation. a sample object is provided below
        var raw = input.split("\n");
        var parsed = { 
            bounds: [],
            robos: []
        };

        for(var i = 0; i < raw.length; i++){
            if(i === 0){ //parse bounds
                var bounds = stringToArray(raw[i]).map(Number);
                 parsed.bounds = bounds;
            }else{
                if(i % 2 == 1){
                    var coords = stringToArray(raw[i]);
                    // Odd (coords)
                    parsed.robos.push({x: parseInt(coords[0]), y: parseInt(coords[1]), o: coords[2].toLowerCase()});
                }else if(i % 2 == 0){
                    // Even (command)
                    parsed.robos[parsed.robos.length-1].command = raw[i].trim().toLowerCase().split('');
                }
            }
        }
        return parsed;
    };

    function stringToArray(value)
    {
        return value.trim().toLowerCase().split(' ');
    }

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

        var commandCount = 0;
        // !== write robot logic here ==!
        for(var i = 0; i < robos.length; i++){
            var data = robos[i];
            if(data.command.length > 0 && data.o != DEAD){
                var dir = data.command.splice(0, 1)[0];
                commandCount++;
                // Get new position and direction
                var updated = getProjected(data.o, {x: data.x, y: data.y}, dir);
                
                // Check if it is in bounds
                if(isOutOfBounds({x: updated.x, y:updated.y}) == false){
                    robos[i] = updated;
                    robos[i].command = data.command;    
                }else{
                    var match = false;
                    for(var j = 0; j < fallen.length; j++){
                        var f = fallen[j];
                        if(f.x === updated.x && f.y === updated.y){
                            // This position has been encountered before, ignore this command
                            match = true;
                            break;
                        }
                    }

                    if(!match){
                        // This is a new, unknown edge.  Kill the soldier and leave
                        // obituary.
                        console.log("out of bounds");
                        robos[i].o = DEAD;
                        robos[i].killerMove = dir;
                        fallen.push(robos[i]);
                    }
                    else
                    {
                        // Update command only
                        robos[i].command = data.command; 
                    }
                    
                }
            }
        };

        if(commandCount > 0){
            //leave the below line in place
            placeRobos(robos);
        } else {
            // We are done, summarize mission
            console.log("Complete!");
            missionSummary(robos);
        }
 
    };

    // Given an orientation, return modified x,y coords by 1
    var getProjected = function(orientation, point, direction){
        
        var y = point.y;
        var x = point.x;
        var o = orientation;
        
        if(direction === 'f'){
            x += orientation === 'e' ? 1 : (orientation === 'w' ? -1 : 0);
            y += orientation === 'n' ? -1 : (orientation === 's' ? 1 : 0);
        }else{ 
            // get new orientation
            var ordinals = ['n','e','s','w'];
            var index = ordinals.indexOf(orientation);
            if(direction === 'r'){
                // Turn right
                o = ordinals[(index + 1) <= 3 ? index + 1 : 0];
            } else if(direction === 'l'){
                // Turn left
                o = ordinals[(index - 1) >= 0 ? index - 1 : 3];
            }           
        }

        return {x: x, y:y, o: o}; 
    }

    var isOutOfBounds = function(point){
        if(point.x < 0 || point.x > bounds[0]-1){
            return true;
        } else if (point.y < 0 || point.y > bounds[1]-1){
            return true;
        }
        return false;
    }

    // mission summary function
    var missionSummary = function (robos) {
        // task #3
        var living = [];
        var dead = [];
        // summarize the mission and inject the results into the DOM elements referenced in readme.md
        for(var i = 0; i < robos.length; i++){
            var r = robos[i];
            var alive = r.o !== DEAD;
            if(alive){
                living.push("<li>Position: " + r.x + ", " + r.y + " | " + r.o + "</li>");
            }else{
                dead.push("<li>Position: " + r.x + ", " + r.y + ", Killer move: " + r.killerMove + ", Remaining commands: " + r.command.join(', ') + "</li>");
            }
        }

        if(living.length > 0){
           document.getElementById("robots").innerHTML = "<li style='list-style:none'>Robots remaining:</li><ul>" + living.join('') + "</ul>";    
        }
        
        if(dead.length > 0){
            document.getElementById("lostRobots").innerHTML = "<li style='list-style:none'>Robots lost:</li><ul>" + dead.join('') + "</ul>";    
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

