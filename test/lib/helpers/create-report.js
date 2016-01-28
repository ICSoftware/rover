
import { expect } from 'chai';

import createReport from 'helpers/create-report';

const position = {

  x: 1, y: 2

};

const orientation = 'W';

const instructions = ['l', 'r'];

const killerInstruction = 'f';

const positionXRegExp = new RegExp(`${position.x}`);
const positionYRegExp = new RegExp(`${position.y}`);
const orientationRegExp = new RegExp(orientation);
const instructionsRegExps = instructions.map(instruction => new RegExp(instruction));
const killerInstructionRegExp = new RegExp(killerInstruction);

function allMissionRegularExpressionTests (position, orientation, instructions, killerInstruction) {
  
  [
      positionXRegExp,
      positionYRegExp,
      orientationRegExp
    ].forEach((regexp) => {

      it(`should contain regular expression ${regexp}`, () => {

        expect(regexp.test(createReport(position, orientation, instructions, killerInstruction))).to.equal(true);

      });

    });

}

describe('create report', () => {

  describe('successful mission', () => {

    allMissionRegularExpressionTests(position, orientation);

  });

  describe('failed mission', () => {

    allMissionRegularExpressionTests(position, orientation, instructions, killerInstruction);

    it('should contain all left over instructions', () => {

      instructionsRegExps.forEach((regexp) =>
        expect(regexp.test(createReport(position, orientation, instructions, killerInstruction))).to.equal(true));

    });

    it('should have killer instruction regular expression', () => {

      expect(killerInstructionRegExp.test(createReport(position, orientation, instructions, killerInstruction))).to.equal(true);

    });

  });

});