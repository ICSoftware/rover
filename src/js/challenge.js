'use strict';
/* globals _, engine */
// stub window for serverside check
if (!window) {
    window = {};
};

export function initGame() {
    window.initGame = function () {
        console.log('initgame');

        var scents = [];

        // you're really better off leaving this line alone, i promise.
        var command =
            '5 3 \n 1 1 s\n ffffff\n 2 1 w \n flfffffrrfffffff\n 0 3 w\n LLFFFLFLFL';

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

            // replace this with a correct object
            /*var parsed = {
             bounds: [20, 20],
             robos: [{
             x: 2,
             y: 1,
             o: 'W',
             command: 'rlrlrff'
             }, {
             x: 12,
             y: 10,
             o: 'E',
             command: 'fffffffffff'
             }, {
             x: 18,
             y: 8,
             o: 'N',
             command: 'frlrlrlr'
             }]
             };*/

            // this implementation is naively assuming that the input is valid
            // should be refactored to ensure validation such as:
            //   1. commands separated by new lines
            //   2. first line contains two integer values
            //   3. subsequent commands are composed of two lines
            //     3a. first line contains integer integer string
            //     3b. value of orientation string is in (n, e, s, w)
            //     3c. command string composed of only (f,l,r)
            const COMMAND = input;
            let commands = COMMAND.split('\n').map( (value) => value.trim());
            let bounds = commands.shift().trim().split(' ').map( (value) => parseInt(value));
            var robos = [];

            for(let i=0; i<commands.length; i++) {
                if(i%2 == 0) {
                    let rover = commands[i].split(' ').map( (value) => isNaN(value) ? value : parseInt(value));
                    let [x, y, o] = rover;
                    let item = {x, y, o};
                    item.command = undefined;
                    robos.push(item);
                } else {
                    let cmd = commands[i];
                    robos[robos.length-1].command = cmd;
                }
            }

            // Store the gameboard bounds so that it can be accessed by
            // utility functions
            window.BOUNDS = bounds;
            return {bounds, robos};

            //return parsed;
        };

        // this function replaces the robos after they complete one instruction
        // from their commandset
        var tickRobos = function (robos) {
            console.log('tickrobos');
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
            const ORIENTATION = ['n','e','s','w'];
            for(let i = 0; i < robos.length; i++) {
                let newValue = Object.assign( {}, robos[i]);
                let oIndex = ORIENTATION.indexOf(newValue.o);
                let newOIndex;

                let testCommand = newValue.command.slice(0,1).toUpperCase();
                // should investigate if there is a more performant way to handle
                // this than in a switch statement
                switch( testCommand ) {
                    case 'F':
                        switch(newValue.o.toUpperCase()) {
                            case 'N':
                                newValue.y -= 1;
                                break;
                            case 'S':
                                newValue.y += 1;
                                break;
                            case 'E':
                                newValue.x += 1;
                                break;
                            case 'W':
                                newValue.x -= 1;
                                break;
                        }
                        break;

                    case 'L':
                        newOIndex = (oIndex == 0) ? 3 : oIndex - 1;
                        newValue.o = ORIENTATION[newOIndex];
                        break;
                    case 'R':
                        newOIndex = (oIndex == 3) ? 0 : oIndex + 1;
                        newValue.o = ORIENTATION[newOIndex];
                        break;
                }

                // isScented returns true if a previous robot was lost when
                // departing from this coordinate
                let isScented = hasScent({x: robos[i].x, y: robos[i].y});

                // isOutOfBounds returns true if final robot coorinate is
                // of the bounding grid
                let isOutOfBounds = outOfBounds({x: newValue.x, y: newValue.y});

                if( isOutOfBounds && isScented) {
                    // revert the requested move
                    // doesn't read cleanly; candidate for refactoring
                    newValue.x = robos[i].x;
                    newValue.y = robos[i].y;
                    newValue.o = robos[i].o;
                } else if (isOutOfBounds && !isScented) {
                    // the robot is moving off the grid and no prior robot has left the grid
                    // from this location
                    //
                    // the instructions implied the lost robot should be removed from the robos
                    // array but I found doing that always caused the test confirmation to fail
                    //
                    // added a lost flag to the robos array for robots that have left the grid
                    // it helps ensure i don't add duplicate bots to the scent array that continue
                    // to move off the grid (because they are still in the robos array)
                    if(!newValue.lost)  {
                        scents.push({x: robos[i].x, y: robos[i].y, o: robos[i].o});
                        newValue.lost = true;
                    }
                }

                // in all cases pop the current command off the queue
                newValue.command = newValue.command.slice(1);
                robos[i] = newValue;
            }

            // return the mutated robos object from the input to match the new state
            // return ???;
            return robos;
        };

        // utility function to determine if robot would be on the grid after
        // executing a move command
        var outOfBounds = function ( {x, y} ) {
            return x < 0 || y < 0 || x > window.BOUNDS[0] || y > window.BOUNDS[1];
        };

        // utility function to see if a grid coordinate already exists in
        // the lost robots scent array
        // Not really happy with this; would benefit from optimization
        var hasScent = function( {x, y} ) {
            // if the scents array is empty short circuit
            if(scents.length === 0) {
                return false;
            }
            let match = scents.filter( (value)  => {
                return (value.x === x && value.y === y);
            });

            return match.length > 0;
        };

        // mission summary function
        var missionSummary = function (robos) {
            //
            // task #3
            //
            // summarize the mission and inject the results into the DOM elements referenced in readme.md
            //

            // make sure none of the robos objects have remaining commands to execute
            for(let i = 0; i < robos.length; i++) {
                if(robos[i].command.length > 0) {
                    return;
                }
            }

            // filter robos array to only include objects still within bounds
            // Note: The instructions suggested that lost robots could be removed
            // from the robos array which would have made this step unnecessary
            // but I found removing a lost bot from the array always caused the
            // test validation to fail
            let survivors = robos.filter( ({x, y, o}) => {
                if(x >= 0 && x <= window.BOUNDS[0] && y >=0 && y <= window.BOUNDS[1]) {
                    return {x, y, o};
                };
            })
            // loop over the survivors to create the unordered list in the DOM.
            // Should probably abstract this to its own function so that both surviving
            // and lost robots could share that code
                .map( ({x, y, o}) => {
                    let li = document.createElement('li');
                    var txtNode = document.createTextNode(`Position: ${x}, ${y} | Orientation: ${o.toUpperCase()}`);
                    li.appendChild(txtNode);
                    document.getElementById('robots').appendChild(li);
                });

            // lost robots were added to the scents array
            // loop over that array to create the necessary DOM elements
            scents.map( ({x, y, o}) => {
                let li = document.createElement('li');
                var txtNode = document.createTextNode(`I died going ${o.toUpperCase()} from coordinates ${x}, ${y}`);
                li.appendChild(txtNode);
                document.getElementById('lostRobots').appendChild(li);
            });

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
}
