
import assert from 'assert';

function normalizeCommand (string) {

  return string
    .split(/\n/)
    .map(command => {

      return command.match(/(\d+|\w+)/g);

    });

}

function getUpperRightCoordinates (command) {

  return command.concat().shift()
    .map(coord => {
      
      const int = parseInt(coord, 10);

      assert(!isNaN(int), `You have supplied a non parsable coordinate ${coord}.`);

      return int;

    });

}

function createPositionObject (positionCommand) {

  const x = parseInt(positionCommand[0]);
  const y = parseInt(positionCommand[1]);

  const o /* orientation */ = positionCommand[2].toUpperCase();

  [x, y]
    .forEach(coord => assert(!isNaN(coord), `You have supplied a non parsable coordinate for the position.`));

  assert((/(N|E|S|W)/).test(o), `You have supplied an invalid orientation ${o}. Valid orientations are N, E, S, or W.`);

  return {

    x, y, o

  };

}

function createMovementObject (movementCommand) {

  const movements = movementCommand[0]
    .split('')
    .map(movement => movement.toLowerCase());

  movements
    .forEach(movement => assert((/(f|l|r)/).test(movement), `You have supplied an invalid movement command: ${movement}.  Valid movement commands are l, r, or f.`));

  const command = movements.join('');

  return {

    command

  };

}

function getAllRobosPositionAndInstructions (command) {

  const rawInstructions = command.concat();

  // remove upper right coordinates
  rawInstructions.shift();

  assert(rawInstructions.length % 2 === 0, 'Not enough pairs.  Each robot requires a pair of instructions, orientation/coordinates and movement instructions.');

  const instructions = [];

  for (let i = 0 ; i < rawInstructions.length ; i += 2) {
  
    const position = createPositionObject(rawInstructions[i]);
    const movements = createMovementObject(rawInstructions[i + 1]);

    instructions.push(Object.assign({}, position, movements));

  }

  return instructions;
}

export default function stringCommandParser (commandString) {

  const command = normalizeCommand(commandString);

  assert(command.length % 2 !== 0, 'Command string must have an odd number of arguments');

  const bounds = getUpperRightCoordinates(command);
  const robos = getAllRobosPositionAndInstructions(command);

  return {

    bounds, robos

  };

}