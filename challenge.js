'use strict';
/* globals _, engine */
// stub window for serverside check
if (!window) {
    window = {};
};
window.initGame = function () {
    console.log('initgame');

    var command =
        '5 3 \n 1 1 s\n ffffff\n 2 1 w \n flfffffrrfffffff\n 0 3 w\n LLFFFLFLFL';
    
    var mapChunk = function(chunk) {
        var robo = {}
        robo.x = Number(chunk[0][0])
        robo.y = Number(chunk[0][1])
        robo.o = _.upperCase(chunk[0][2])
        robo.command = _.lowerCase(chunk[1])

        return robo
    }
    
    var parseInput = function (input) {
        
        var tokens = input.replace(/ /g,'').split('\n');

        var bounds = _.map(tokens.shift().split(''),function(s){return Number(s)})

        var robos = _.map(_.chunk(tokens, 2), mapChunk)

        var parsed = {bounds: bounds, robos: robos}

        return parsed;
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

        // return the mutated robos object from the input to match the new state
        // return ???;
    };
    // mission summary function
    var missionSummary = function (robos) {
        //
        // task #3
        //
        // summarize the mission and inject the results into the DOM elements referenced in readme.md
        //
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

