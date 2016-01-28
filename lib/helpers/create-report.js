
export default function createReport (position, orientation, instructions = [], killerInstruction = '') {

  let reportText = `Position: ${position.x}, ${position.y} | Orientation: ${orientation}`;

  if (instructions.length > 0) {

    reportText += ' | Left Over Instructions: ';

    instructions.forEach((instruction, index) =>
      reportText += `${instruction}${index !== instructions.length - 1 ? ', ' : ''}`);

    reportText += ` | Killer Instruction: ${killerInstruction}`;

  }
  
  return reportText;

}