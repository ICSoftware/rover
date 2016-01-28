

const orientations = ['N', 'E', 'S', 'W'];
const directionConstants = {
  'N': -1,
  'S': 1,
  'E': 1,
  'W': -1
};

let theDead = [];

function getNextOrientation (movement, currentOrientation) {

  if (movement === 'r') {
    
    const index = (orientations.indexOf(currentOrientation) + 1) % 4;

    return orientations[index];

  }

  else if (movement === 'l' && currentOrientation === 'N') {

    return 'W';

  }

  else {

    const index = orientations.indexOf(currentOrientation) - 1;

    return orientations[index];

  }

}

function getNextCoord (orientation, currentCoord) {

  const { x, y } = currentCoord;

  if (theDead.length > 0) {

    let stayPut = false;

    theDead.forEach((robo) => {

      if (robo.previous && 
          robo.o === orientation &&
          robo.previous.x === x &&
          robo.previous.y === y) {

        stayPut = true;

      }

    });
    // console.log(stayPut);
    if (stayPut) {

      return currentCoord;

    }

  }

  if (/N|S/.test(orientation)) {

    return {
      
      x,
      y: y + directionConstants[orientation]

    };

  }

  else {

    return {

      x: x + directionConstants[orientation],
      y

    };

  }

}

function moveToNextPosition (robo) {

  if (!robo.executedCommands) {

    robo.executedCommands = '';

  }

  const nextMovement = robo.command.substring(0, 1);
  const currentOrientation = robo.o;

  if (/l|r/.test(nextMovement)) {
    
    const nextOrientation = getNextOrientation(nextMovement, currentOrientation);

    robo.o = nextOrientation;
      
  }

  else if (/f/.test(nextMovement)) {

    const { x, y } = robo;
    const currentCoord = { x, y };

    const nextCoord = getNextCoord(currentOrientation, currentCoord);

    Object.assign(robo, nextCoord);

    if (!robo.previous) {

      robo.previous = {};

    }

    robo.previous = { x, y };

  }

  robo.command = robo.command.substring(1, robo.command.length);
  robo.executedCommands += nextMovement;

  return robo;

}

function evaluateTheDead (robo, bounds) {
  
  if (!bounds) {

    return true;

  }

  const { x, y } = robo;

  if (x < 0 || 
      y < 0 ||
      x > bounds.x ||
      y > bounds.y) {

    theDead.push(robo);
    robo.dead = true;
    // console.log(robo);
    return false;

  }

  else {

    return true;

  }

}

export let gatherTheDead = () => theDead;
export let clearTheDead = () => theDead = [];

export default function scooby (robos, bounds) {
  
  return robos
    .filter(robo => !robo.dead)
    .map(moveToNextPosition)
    .filter(robo => evaluateTheDead(robo, bounds));

  // robos
  //   .forEach((robo, i) => evaluateTheDead(robo, bounds, robos, i));

  // return robos;

}