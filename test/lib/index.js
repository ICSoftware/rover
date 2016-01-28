
import { expect } from 'chai';

import 'index';

describe('document elements', () => {

  it('document should have an h1', () => {
    
    const h1 = document.querySelector('h1', document.body);

    expect(!h1).to.equal(false);

  });

  it('document should have a canvas', () => {
    
    const canvas = document.querySelector('canvas', document.body);

    expect(!canvas).to.equal(false);

  });

  it('document should have a meta div', () => {
    
    const meta = document.querySelector('div.meta', document.body);

    expect(!meta).to.equal(false);

  });

  it('document should have robots list', () => {
    
    const robots = document.querySelector('#robots', document.body);

    expect(!robots).to.equal(false);

  });

  it('document should have lost robots list', () => {
    
    const lostRobots = document.querySelector('#lostRobots', document.body);

    expect(!lostRobots).to.equal(false);

  });

});