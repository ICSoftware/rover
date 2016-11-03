'use strict';
/* globals _, engine */
// stub window for serverside check
if (!window) {
    window = {};
};
window.initGame = function () {
    // you're really better off leaving this line alone, i promise.
    var command =
        '5 3 \n 1 1 s\n ffffff\n 2 1 w \n flfffffrrfffffff\n 0 3 w\n LLFFFLFLFL';

    // Define some global limits
    const maxCoordinateValue = 50;
    const maxInstructionLength = 100;
    // Define the global grid bounds. 
    let bounds;
    // A global hash to keep track of where robots have left the board. 
    const scent = {};
    // An global array of lost robots. 
    const lostRobots = [];

    // The following function changes the orientation of a robot. 
    function changeRobotOrientation(currentOrientation, turn) {
        // the following hash maps the current orientation to a new orientation 
        // based on the direction that a robot is turning. 
        const orientationMap = {
            'n': {
                'l': 'w',
                'r': 'e'
            },
            'e': {
                'l': 'n',
                'r': 's'
            },
            's': {
                'l': 'e',
                'r': 'w'
            },
            'w': {
                'l': 's',
                'r': 'n'
            }
        };
        return orientationMap[currentOrientation][turn];
    }

    // The following function 'scents' a robot's current position.
    // Return true if position was already scented.
    // Returns false if position has not been scented.
    function detectRobotScent(robot) {
        if (!scent[robot.x]) {
            scent[robot.x] = {};
        }
        else if (scent[robot.x][robot.y]) {
            return true;
        }
        // Robot falling off of the board. Scent it. 
        scent[robot.x][robot.y] = true;
        return false;
    }

    // The following function moves a robot forward if possible.
    // Returns true if robot moved forward (or if the robot 'scented' a position)
    // Returns false if robot falls off the board.  
    function moveRobotForward(robot) {

        var boundsX = bounds[0];
        var boundsY = bounds[1];

        switch (robot.o) {
        case 'n':
            if (robot.y === 0) {
                return detectRobotScent(robot) ? true: false;
            }
            robot.y = robot.y - 1;
            return true;
        case 'e':
            if (robot.x === boundsX) {
                return detectRobotScent(robot) ? true: false;
            }
            robot.x = robot.x + 1;
            return true;
        case 's':
            if (robot.y === boundsY) {
                return detectRobotScent(robot) ? true: false;
            }
            robot.y = robot.y + 1;
            return true;
        case 'w':
            if (robot.x === 0) {
                return detectRobotScent(robot) ? true: false;
            }
            robot.x = robot.x - 1;
            return true;
        default:
            console.error('Unexpected direction');
            return false;
        }
    }

    // The following utility parses a coordinate. 
    function parseCoordStr(coordStr) {
        var coord = parseInt(coordStr, 10);
        if (isNaN(coord)) {
            throw Error('Could not parse coordinate string ' +  coordStr);
        };

        if (coord > maxCoordinateValue) {
            throw Error('Coordinates cannot be greater than ' + maxCoordinateValue);
        }
        return coord;
    }

    // this function parses the input string so that we have useful names/parameters
    // to define the playfield and robots for subsequent steps
    var parseInput = function (input) {
        //
        // task #1 
        //
        // replace the 'parsed' var below to be the string 'command' parsed into an object we can pass to genworld();
        // genworld expects an input object in the form { 'bounds': [3, 8], 'robos': [{x: 2, y: 1, o: 'W', command: 'rlrlff'}]}
        // where bounds represents the top right corner of the plane and each robos object represents the
        // x,y coordinates of a robot and o is a string representing their orientation. a sample object is provided below
        //
        if (!input) {
            throw Error('Expecting input to parse');
        }

        // split the input by new line.
        const split = input.split('\n');

        // setup bounds regular expression.
        const boundsRe = /(\d+)(\s)(\d+)/

        // Extract the bounds. 
        let line; 
        line = split[0].trim();
        let result = boundsRe.exec(line);
        if (!result) {
            throw Error('Invalid bounds');
        }
        let upperRightCoordX = parseCoordStr(result[1]);
        let upperRightCoordY = parseCoordStr(result[3]);

        // Initialize the parsed data.
        bounds = [upperRightCoordX, upperRightCoordY];
        const parsed = {
            bounds: bounds, 
            robos: []
        };

        // Initialize the position regex and instructions regex.        
        var positionRe = /(\d+)\s(\d+)\s+(n|e|w|s)/
        var instructionRe = /(f|l|r)+/i;

        let i = 1;
        while (i < split.length) {

            // Extract the coordinates and orientation of the robot.
            line = split[i].trim();
            result = positionRe.exec(line);
            if (!result) {
                throw Error('Invalid coordinates');
            }
            upperRightCoordX = parseCoordStr(result[1]);
            upperRightCoordY = parseCoordStr(result[2]);
            const orientation = result[3].toLowerCase();
            i++;

            // Extract the instructions for the robot.
            line = split[i].trim().toLowerCase();
            if (line.length > maxInstructionLength) {
                throw Error('Instruction length must be less than ', maxInstructionLength);
            }
            result = instructionRe.exec(line);
            if (!result) {
                throw new Error('Invalid instructions');
            }
            parsed.robos.push({
                x: upperRightCoordX,
                y: upperRightCoordY,
                o: orientation,
                command: line
            });
            i++;
        }
        return parsed;
    };

    // this function replaces the robos after they complete one instruction
    // from their commandset
    var tickRobos = function (robos) {
        // 
        // task #2
        //
        // in this function, write business logic to move robots around the playfield
        // the 'robos' input is an array of objects; each object has 4 parameters.
        // This function needs to edit each robot in the array so that its x/y coordinates
        // and orientation parameters match the robot state after 1 command has been completed. 
        // Also, you need to remove the command the robot just completed from the command list.
        // example input:
        //
        // robos[0] = {x: 2, y: 2, o: 'N', command: 'frlrlrl'}
        //
        //                   - becomes -
        // 
        // robos[0] = {x: 2, y: 1, o: 'N', command: 'rlrlrl'} 
        //
        // if a robot leaves the bounds of the playfield, it should be removed from the robos
        // array. It should leave a 'scent' in it's place. If another robot–for the duration
        // of its commandset–encounters this 'scent', it should refuse any commands that would
        // cause it to leave the playfield.

        // write robot logic here

        // return the mutated robos object from the input to match the new state
        // return ???;

        // Keep track if any robot commands were issued. 
        // If there were no commands issued, then a mission summary is presented to the user. 
        let commandProcessed = false;

        // Loop through all the robos and process commands. 
        for (let rIx = 0; rIx < robos.length; ++rIx) {
            let robot = robos[rIx];
            if (!robot.command) {
                // No commands left for this robot, continue;
                continue;
            }
            let command = robot.command.charAt(0).trim();

            commandProcessed = true;

            // Process each command. 
            switch (command) {
            case 'l':
            case 'r':
                robot.o = changeRobotOrientation(robot.o, command);
                break;
            case 'f':
                // Attempt to move forward.
                if (!moveRobotForward(robot)) {
                    // Cannot move forward, remove this robo.
                    robos = _.filter(robos, function (robo, index) {
                        return rIx != index;
                    });
                    lostRobots.push(robot);
                    if (!robos.length) {
                        // No robos left to process, show the mission summary.
                        missionSummary(robos);
                    }
                };
                break;
            default:
                console.log('Unexpected command');
            }
            // Remove the command from the command stack. 
            robot.command = robot.command.substring(1);
        }

        if (!commandProcessed) {
            // Done with all commands for robos. 
            missionSummary(robos);
        }
        return robos;
    };

    // Setup the DOM for the surviving robots list. 
    function makeSurvivingRobosList(array) {
        let list = document.createElement('ul');
        for (var i = 0; i < array.length; i++) {
            let data = array[i];
            let item = document.createElement('li');
            let text = 'Position: ' + data.x + ', ' + data.y + ' | ' + 'Orientation: ' + data.o.toUpperCase();
            item.appendChild(document.createTextNode(text));
            list.appendChild(item);
        }
        return list;
    }

    // Setup the DOM for the lost robots list. 
    function makeLostRobosList(array) {
        let list = document.createElement('ul');
        for (let i = 0; i < array.length; i++) {
            let data = array[i];
            let item = document.createElement('li');
            let text = 'I died going ' + data.o.toUpperCase() + ' from coordinates: ' + data.x + ' ' + data.y;
            item.appendChild(document.createTextNode(text));
            list.appendChild(item);
        }
        return list;
    }

    // mission summary function
    var missionSummary = function (survivingRobos) {
        //
        // task #3
        //
        // summarize the mission and inject the results into the DOM elements referenced in readme.md
        //
        document.getElementById('robots')
            .appendChild(makeSurvivingRobosList(survivingRobos));

        document.getElementById('lostRobots')
            .appendChild(makeLostRobosList(lostRobots));

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
