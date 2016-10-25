'use strict';
/* globals _, engine */
// stub window for serverside check
if (!window) {
    window = {};
};
window.initGame = function () {
    console.log('initgame');
    // you're really better off leaving this line alone, i promise.
    var command =
        '5 3 \n 1 1 s\n ffffff\n 2 1 w \n flfffffrrfffffff\n 0 3 w\n LLFFFLFLFL',
        bounds = [],
        warningTiles = [];

    // this function parses the input string so that we have useful names/parameters
    // to define the playfield and robots for subsequent steps
    var parseInput = function (input) {
        //
        // task #1 
        //
        // replace the 'parsed' var below to be the string 'command' parsed into an object we can pass to genworld();
        // genworld expects an input object in the form { 'bounds': [3, 8], 'robos': [{x: 2, y: 1, o: 'w', command: 'rlrlff'}]}
        // where bounds represents the top right corner of the plane and each robos object represents the
        // x,y coordinates of a robot and o is a string representing their orientation. a sample object is provided below
        //

        var parsed = {}, roboPositionArr, roboData;
        input = input.split('\n');
        parsed.bounds = bounds = input[0].trim().split(' ').map( function(bound){
            return bound * 1;
        });
        parsed.robos = [];
        input.forEach( function(item, index) {
            if(index > 0 && index % 2 !== 0) {
                roboData = {};
                roboPositionArr = item.trim().split(' ');
                roboData.x = roboPositionArr[0] * 1;
                roboData.y = roboPositionArr[1] * 1;
                roboData.o = roboPositionArr[2].toLowerCase();
                parsed.robos.push(roboData);
            } else if(!!roboData) {
                roboData.command = item.trim().toLowerCase();
            }
        });

        return parsed;
    };

    // We attempt to find the tile that matches the passed robot data
    var checkTiles = function(roboData) {
        var tile = warningTiles.find(function(tile) {
            if(roboData.x === tile.x && roboData.y === tile.y && roboData.o === tile.o) {
                return true;
            }
        });
        if(!!tile) {
            return true;
        } else {
            return false;
        }
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
        // robos[0] = {x: 2, y: 2, o: 'n', command: 'frlrlrl'}
        //
        //                   - becomes -
        // 
        // robos[0] = {x: 2, y: 1, o: 'n', command: 'rlrlrl'} 
        //
        // if a robot leaves the bounds of the playfield, it should be removed from the robos
        // array. It should leave a 'scent' in it's place. If another robot–for the duration
        // of its commandset–encounters this 'scent', it should refuse any commands that would
        // cause it to leave the playfield.

        // write robot logic here
        var completedRobotCount = 0,
            outOfBoundsRobots = 0,
            liveRobots = [];

        robos.forEach( function(roboData) {

            var command = roboData.command[0];

            if(typeof command === 'undefined') {
                liveRobots.push(roboData);
                return;
            }

            roboData.command = roboData.command.substring(1);

            if(command === 'f' && roboData.o === 'n') {
                if(!checkTiles(roboData)) {
                   roboData.y--;
                }
            } else if(command === 'f' && roboData.o === 's') {
                if(!checkTiles(roboData)) {
                    roboData.y++;    
                }
            } else if(command === 'f' && roboData.o === 'e') {
                if(!checkTiles(roboData)) {
                    roboData.x++;
                }
            } else if(command === 'f' && roboData.o === 'w') {
                if(!checkTiles(roboData)) {
                    roboData.x--;
                }
            } else if(command === 'l' && roboData.o === 'n') {
                roboData.o = 'w';
            } else if(command === 'l' && roboData.o === 's') {
                roboData.o = 'e';
            } else if(command === 'l' && roboData.o === 'e') {
                roboData.o = 'n';
            } else if(command === 'l' && roboData.o === 'w') {
                roboData.o = 's';
            } else if(command === 'r' && roboData.o === 'n') {
                roboData.o = 'e';
            } else if(command === 'r' && roboData.o === 's') {
                roboData.o = 'w';
            } else if(command === 'r' && roboData.o === 'e') {
                roboData.o = 's';
            } else if(command === 'r' && roboData.o === 'w') {
                roboData.o = 'n';
            }

            // If updated robo position is out of bounds, our robot is dead!
            // Don't worry, we'll warn the others
            if( roboData.x < 0 
                || roboData.x > bounds[0]
                || roboData.y > bounds[1]
                || roboData.y < 0) {

                if(roboData.o === 'n') {
                    warningTiles.push({
                        o: 'n',
                        x: roboData.x,
                        y: roboData.y + 1
                    });
                } else if(roboData.o === 's') {
                    warningTiles.push({
                        o: 's',
                        x: roboData.x,
                        y: roboData.y - 1
                    });
                } else if(roboData.o === 'e') {
                    warningTiles.push({
                        o: 'e',
                        x: roboData.x - 1,
                        y: roboData.y
                    });
                } else if(roboData.o === 'w') {
                    warningTiles.push({
                        o: 'w',
                        x: roboData.x + 1,
                        y: roboData.y
                    });
                }

            } else {
                liveRobots.push(roboData);
            }
            
        });

        // return the mutated robos object from the input to match the new state
        return liveRobots;
    };

    // mission summary function
    var missionSummary = function (robos) {
        
        //
        // task #3
        //
        // summarize the mission and inject the results into the DOM elements referenced in readme.md
        //
        var robotsSummaryEl = document.getElementById('robots'),
            lostRobotsEl = document.getElementById('lostRobots'),
            li;

        robos.forEach( function(roboData){
            li = document.createElement('li');
            li.innerText = 'Position: ' + roboData.x + ', ' + roboData.y + ' | Orientation: ' + roboData.o;
            robotsSummaryEl.appendChild(li);
        });

        warningTiles.forEach( function(tile) {
            li = document.createElement('li');
            li.innerText = 'I died going ' + tile.o + ' from coordinates: ' + tile.x + ', ' + tile.y;
            lostRobotsEl.appendChild(li);
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

