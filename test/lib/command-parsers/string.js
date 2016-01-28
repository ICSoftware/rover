
import { expect } from 'chai';

import stringCommandParser from 'command-parsers/string';

import validCommandObject from '../../fixtures/valid-command-object';

const command = '10 10 \n 1 1 e\n rfrfrfrf\n 3 2 N \n frrffllffrrfll\n 0 3 w\n LLFFFLFLFL';

const missingBoundsCommnand = '1 1 e\n rfrfrfrf\n 3 2 N \n frrffllffrrfll\n 0 3 w\n LLFFFLFLFL';

const invalidBoundsCommand = 'a 3 \n 1 1 e\n rfrfrfrf\n 3 2 N \n frrffllffrrfll\n 0 3 w\n LLFFFLFLFL';

const invalidCoordCommand = '5 3 \n 1 a e\n rfrfrfrf\n 3 2 N \n frrffllffrrfll\n 0 3 w\n LLFFFLFLFL';

const invalidOrientationCommand = '5 3 \n 1 1 y\n rfrfrfrf\n 3 2 N \n frrffllffrrfll\n 0 3 w\n LLFFFLFLFL';

const invalidDirectionCommand = '5 3 \n 1 1 e\n rfrfrfrf\n 3 2 N \n frrfnllffrrfll\n 0 3 w\n LLFFFLFLFL';

describe('string command parser', () => {

  it('should produce parsed command from a valid string', () => {

    const parsedCommand = stringCommandParser(command);

    expect(parsedCommand).to.eql(validCommandObject);

  });

  it('should throw an exception when missing bounds', () => {

    expect(() => stringCommandParser(missingBoundsCommnand)).to.throw();

  });

  it('should throw an exception with invalid bounds', () => {

    expect(() => stringCommandParser(invalidBoundsCommand)).to.throw();

  });

  it('should throw an exception with invalid coord', () => {

    expect(() => stringCommandParser(invalidCoordCommand)).to.throw();

  });

  it('should throw an exception with invalid orientation', () => {

    expect(() => stringCommandParser(invalidOrientationCommand)).to.throw();

  });

  it('should throw an exception with invalid direction', () => {

    expect(() => stringCommandParser(invalidDirectionCommand)).to.throw();

  });

});