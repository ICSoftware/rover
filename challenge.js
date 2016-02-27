'use strict';
window.onload = function () {
       var command = '20 20 \n 1 1 e\n rfrfffrfrf\n 13 2 N \n frrffllffrrfll\n 0 3 w\n LLFFFLFLFL';

 //var command = '20 20 \n 1 1 e\n rfrfffrfrf\n';//  1 4 n\n ffflfflf';
    // this function parses the input string so that we have useful names/parameters
    // to define the playfield and the robots for subsequent steps
    var parseInput = function (input) {
        //Removing \n and cleaning the array by removing the empty elements
       var  commandParse=command.replace(/\n/g,"").split(" ") ;
       var commandParseClean=new Array();
       for (var i = 0; i < commandParse.length; i++) {
           if (commandParse[i]) {
            commandParseClean.push(commandParse[i]);
           }
        }
       
       
       //Defining parsed object, setting the boundary of the field and
       // setting the properties of parsed object

        var parsed=new Object();
        parsed.bounds=[commandParseClean[0],commandParseClean[1]];
        parsed.robos=new Array();
        
     
      var j=0;
      
        for (var i=2;i<commandParseClean.length-3;i=i+4){
          parsed.robos[j]={
            x:commandParseClean[i],
            y:commandParseClean[i+1],
            o:commandParseClean[i+2].toLowerCase(),
            command:commandParseClean[i+3].toLowerCase()+''
                         
          };
         j++;   
        }
        
       //Defining Global variables to set the boundary of the field and the number of 
       //robots that are not lost.
        window.executedCommand=new Array();
        window.activeRobots=new Array();
        window.boundry =parsed.bounds;
         for (var i=0;i<parsed.robos.length;i++){
             
             
            activeRobots[i]=i;
            
        }
        //scenet is an array that will contains the information of lost robots.
        window.scent=new Array();
        return parsed;
    };
    // this function replaces teh robos after they complete one instruction
    // from their commandset
    var tickRobos = function (robos) {
        
        
      
        //Take actions for active robots
        for (var i=0;i<activeRobots.length;i++){
            
            executedCommand[activeRobots[i]]=(executedCommand[activeRobots[i]] ? executedCommand[activeRobots[i]]+robos[activeRobots[i]].command.substr(0,1) : robos[activeRobots[i]].command.substr(0,1));
            
            //Get a command for an active robot
            if (robos[activeRobots[i]].command.substr(0,1)=='l' ){
                if (robos[activeRobots[i]].o=="n" ){ robos[activeRobots[i]].o="w"; }
                else if (robos[activeRobots[i]].o=="w" ){ robos[activeRobots[i]].o="s"; }
                else if (robos[activeRobots[i]].o=="s" ){ robos[activeRobots[i]].o="e"; }
                else if (robos[activeRobots[i]].o=="e" ){ robos[activeRobots[i]].o="n"; }
                
            }
            
           if (robos[activeRobots[i]].command.substr(0,1)=='r' ){
               
                if (robos[activeRobots[i]].o=="n" ){ robos[activeRobots[i]].o="e"; }
                else if (robos[activeRobots[i]].o=="e" ){ robos[activeRobots[i]].o="s"; }
                else if (robos[activeRobots[i]].o=="s" ){ robos[activeRobots[i]].o="w"; }
                else if (robos[activeRobots[i]].o=="w" ){ robos[activeRobots[i]].o="n"; }
                
            }
            
            
             if (robos[activeRobots[i]].command.substr(0,1)=='f' ){
                 
                 
                 var oldx=robos[activeRobots[i]].x;
                 var oldy=robos[activeRobots[i]].y; 
                 var oldo=robos[activeRobots[i]].o;
                 
                 
                 var accpetcommand=true;
                 for (var j=0;j<scent.length;j++){
                     
                     if (Number(robos[activeRobots[i]].x)==scent[j].x && Number(robos[activeRobots[i]].y)==scent[j].y && robos[activeRobots[i]].o==scent[j].o){
                     
                        accpetcommand=false;
                    
                    }
                     }
                     
                 
                 
                 
                 
                 
                if (robos[activeRobots[i]].o=="n" && accpetcommand){robos[activeRobots[i]].y=Number(robos[activeRobots[i]].y)-1; }
                else if (robos[activeRobots[i]].o=="e" && accpetcommand){ robos[activeRobots[i]].x=Number(robos[activeRobots[i]].x)+1; }
                else if (robos[activeRobots[i]].o=="s" && accpetcommand){ robos[activeRobots[i]].y=Number(robos[activeRobots[i]].y)+1; }
                else if (robos[activeRobots[i]].o=="w" && accpetcommand){ robos[activeRobots[i]].x=Number(robos[activeRobots[i]].x)-1; }
                
                //storing the information of the lost robot
                if (Number(robos[activeRobots[i]].x)<0 || Number(robos[activeRobots[i]].y)<0 || Number(robos[activeRobots[i]].y)>=boundry[1] || Number(robos[activeRobots[i]].x)>=boundry[0]){
                scent.push({x:oldx,y:oldy,o:oldo,index:i,leftcommand:robos[activeRobots[i]].command.substr(1,robos[activeRobots[i]].command.length-1)});
                
                }
                
                
            }     
         //Updating the command list   
        robos[activeRobots[i]].command=robos[activeRobots[i]].command.substr(1, robos[activeRobots[i]].command.length-1)+"";                                            
          
        }
        
        var iterate=activeRobots.length;
        //Removing the lost robots from the active robots
        for (var i=0;i<scent.length;i++){
            for (var j=iterate-1;j>-1;j--){
                
                if(scent[i].index==activeRobots[j]){

                    activeRobots.splice(j,1);
                             
                }
            }
        }
        
      
        
        
       var test=1;
        for (var i=0;i<activeRobots.length;i++){
            
            if(robos[activeRobots[i]].command!=""){
                test=0;
            }
            
        }
       
        if (test){
            
            missionSummary(robos);
        }
        
        

        //leave the below line in place
        placeRobos(robos);
    };
    // mission summary function
    var missionSummary = function (robos) {
        var textSurvive="";
        var textdead="";
        for (var i=0;i<activeRobots.length;i++){
            textSurvive=textSurvive+"<li> ID: "+activeRobots[i]+", Position: "+robos[activeRobots[i]].x+", "+robos[activeRobots[i]].y+"| Orientation "+robos[activeRobots[i]].o.toUpperCase()+ "</li>";
            
        }
        for (var i=0;i<scent.length;i++){
            
            textdead=textdead+"<li> ID: "+scent[i].index+", Last Position: "+scent[i].x+", "+scent[i].y+"| Unfinished instructions "+scent[i].leftcommand+", Killing instrucations "+executedCommand[scent[i].index] +"</li>";
            
        }
        
        
        document.getElementById("robots").innerHTML=textSurvive;
        document.getElementById("lostRobots").innerHTML=textdead;
        
        
        
        
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

