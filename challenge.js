'use strict';
window.onload = function () {
    var gbounds;   
    var summarydone = false;
    var command =
        '5 3 \n 1 1 e\n rfrfrfrf\n 3 2 N \n frrffllffrrfll\n 0 3 w\n LLFFFLFLFL';
    // this function parses the input string so that we have useful names/parameters
    // to define the playfield and the robots for subsequent steps
    //
    var trim = function(s){ 
      return s.replace( /^\s+|\s+$/g, '' ); 
    };

    var separateRobots = function(arr){
        var returnobj = {robos: []};
        var robos_arrs = _.chunk(arr,2); // assuming correct input
        
        _.each(robos_arrs, function(robo_arr,i){
          var robo = {};
          var coords = trim(robo_arr[0]).split(" ");
          robo['x'] = parseInt(coords[0]);
          robo['y'] = parseInt(coords[1])
          robo['o'] = coords[2].toUpperCase(); // someone on the input side got lazy?
          robo['id'] = i; // need a unique id...
          robo['command'] = trim(robo_arr[1]);
          returnobj.robos.push(robo);
        });
        return returnobj;
    };

    var parseInput = function(input) {
        var lines = input.split("\n");
        var bounds = trim(lines.shift()).split(" ");
        gbounds = bounds;
        var obj = separateRobots(lines);
        obj['bounds'] = bounds;
        return obj;
    };

    // repurposed from http://stackoverflow.com/questions/24094466/javascript-sum-two-arrays-in-single-iteration - nice util function
    var sumArray = function (arr1,arr2) {
      var sum = [];
      if (arr2 != null && arr1.length == arr2.length) {
          for (var i = 0; i < arr2.length; i++){
              sum.push(arr1[i] + arr2[i]);
          }
      }
      return sum;
    }

    // this function replaces teh robos after they complete one instruction
    // from their commandset
    var forward_instructions = { // there's an inconsistency between the tickRobos comment and the readme.md
      'N': [0,1],
      'E': [1,0],
      'S': [0,-1],
      'W': [-1,0]
    };
    var right = {
      'N': 'E',
      'E': 'S',
      'S': 'W',
      'W': 'N'
    };
    var left = {
      'N': 'W',
      'W': 'S',
      'S': 'E',
      'E': 'N'
    };


    // assuming scents are distinct from lost robots for some reason.  if not, could refactor down.
    var scents = [];
    var isBadForward = function(pos,o){
      var isbad = false;
      _.each(scents, function(sc){ 
        if(pos[0] == sc[0] && pos[1] == sc[1] && pos[2] == sc[2]){
          isbad = true;
        }
      });
      return isbad;
    };

    var lostrobots = [];


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

        var todelete = [];
        var tosummarize = [];
        var cansummarize = true;
        _.each(robos, function(robo,ri){ 
          var instructions = robo.command.split("");
          var currentcommand = instructions.shift();
          if(robo.x < 0 || robo.x >= gbounds[0] || robo.y < 0 || robo.y >= gbounds[1]){
              todelete.unshift(ri);
              lostrobots.push({robo: robo, command: "N/A, someone dropped it off a cliff"});
          }
          if(typeof currentcommand == "undefined"){
              tosummarize.push(robo);
          } else {
              cansummarize = false;
              robo.command = instructions.join("");
              // execute
              if(currentcommand == 'r'){
                robo.o = right[robo.o];
              } else if(currentcommand == 'l'){
                robo.o = left[robo.o];
              } else if(currentcommand == 'f'){
                var currentpos = [robo.x, robo.y, robo.o];
                  if(!isBadForward(currentpos)){
                  var posArr = forward_instructions[robo.o];
                  robo.x += posArr[0];
                  robo.y += posArr[1];
                  // there are problems with the readme.md.  "upper right corner" specified is gbounds[0], gbounds[1], however the world that's displayed is one dot smaller in each dimension - fencepost error!  ergo, have to do >= instead of > in this function...
                  if(robo.x < 0 || robo.x >= gbounds[0] || robo.y < 0 || robo.y >= gbounds[1]){
                      lostrobots.push({robo: robo, command: currentcommand});
                      scents.push(currentpos);
                      todelete.unshift(ri);
                  }
                }
              }
          }
        });
        _.each(todelete, function(i){
            robos.splice(i,1);
        });
        if(!summarydone && cansummarize){
            summarydone = true;
            missionSummary(robos);
            console.log("done!");
        }

        //leave the below line in place
        placeRobos(robos);
    };
    // mission summary function
    var missionSummary = function (robos) {
        // task #3
        // summarize the mission and inject the results into the DOM elements referenced in readme.md
        var ul1 = document.getElementById('robots');
        var ul2 = document.getElementById('lostRobots');
        var rbmeta = document.getElementById('roboMeta');

        _.each(robos, function(robo){
          var li = document.createElement("li");
          li.innerHTML = "Position: " + robo.x + ", " + robo.y + " | Orientation: " + robo.o;
          ul1.appendChild(li);
        });

        _.each(lostrobots, function(robo){
          var li = document.createElement("li");
          li.innerHTML = "Position: " + robo.robo.x + ", " + robo.robo.y + " | Orientation: " + robo.robo.o + " | Last command: " + robo.command + " | Unfinished commands: " + robo.robo.command
          ul2.appendChild(li);
        });

        rbmeta.removeAttribute("style");
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
        gameWorld = _.reverse(gameWorld); // these rows were rendering backwards...
        for (var i = 0; i < gameWorld.length; i++) {
            var blob = gameWorld[i].join('');
            canvas.fillText(blob, 250, i * fontSize + fontSize);
        }
    };
    // wireup init functions for display
    genworld(parseInput(command));
};

