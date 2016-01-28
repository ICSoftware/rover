
import { expect } from 'chai';

import scooby, { gatherTheDead, clearTheDead } from 'drivers/scooby';

describe('driver logic', () => {

  beforeEach(() =>
    clearTheDead());

  it('should properly rotate robo right', () => {

    const robos = [{
      x: 1, y: 1, o: 'N', command: 'rrrr'
    }];

    ['E', 'S', 'W', 'N']
      .forEach(orientation => {

        scooby(robos);
        expect(robos[0].o).to.equal(orientation);

      });
    
  });

  it('should properly rotate robo left', () => {

    const robos = [{
      x: 1, y: 1, o: 'N', command: 'llll'
    }];

    ['W', 'S', 'E', 'N']
      .forEach(orientation => {
        
        scooby(robos);
        expect(robos[0].o).to.equal(orientation);

      });
    
  });

  it('should properly increase and decrease x and y', () => {

    const robos = [{
      x: 1, y: 1, o: 'N', command: 'flflflflf'
    }];

    [
      { x: 1, y: 0 },
      null, 
      { x: 0, y: 0 },
      null,
      { x: 0, y: 1 },
      null,
      { x: 1, y: 1 },
      null,
      { x: 1, y: 0 }
    ].forEach(coord => {
      
      scooby(robos);
      
      if (!coord) {

        return;

      }
      expect(robos[0].x).to.equal(coord.x);
      expect(robos[0].y).to.equal(coord.y);

    });
    
  });

  it('should properly increase and decrease x and y', () => {

    const originalCommand = 'lfrlr';
    const robos = [{
      x: 1, y: 1, o: 'N', command: originalCommand
    }];

    while (robos[0].command !== '') {

      scooby(robos);

    }

    expect(robos[0].executedCommands).to.equal(originalCommand);
    
  });

  it('should properly record death for -1 x', () => {

    let robos = [
      {
        x: -1, y: 1, o: 'N', command: 'l'
      }, 
      {
        x: 0, y: -1, o: 'N', command: 'l'
      }, 
      {
        x: 0, y: 0, o: 'N', command: 'l'
      }, 
      {
        x: 0, y: 2, o: 'N', command: 'l'
      },
      {
        x: 2, y: 0, o: 'N', command: 'l'
      }
    ];

    robos = scooby(robos, { x: 1, y: 1});
    
    expect(robos.length).to.equal(1);
    expect(gatherTheDead().length).to.equal(4);

  });

  it('should not kill itself after previous robo dies', () => {
    
    let robos = [
      {
        x: 0, y: 0, o: 'S', command: 'ffff'
      }, 
      {
        x: 0, y: 1, o: 'S', command: 'fff'
      }, 
    ];

    const bounds = { x: 3, y: 2 };

    robos = scooby(robos, bounds);
    robos = scooby(robos, bounds);
    robos = scooby(robos, bounds);
    robos = scooby(robos, bounds);

    expect(robos.length).to.equal(1);
    expect(gatherTheDead().length).to.equal(1);

  });

});