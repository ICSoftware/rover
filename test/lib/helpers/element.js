
import { expect } from 'chai';

import element from 'helpers/element';

describe('element', () => {

  it('should create an element', () => {

    let state = false;

    const node = document.createElement('div');
    const testElement = element(node);

    testElement.getDOMNode().innerHTML = 'Jesse';

    testElement.getDOMNode().addEventListener('mousedown', () => {
  
      state = !state;

    });

    // assures the state is unchanged after event creation
    expect(state).to.equal(false);

    const mouseEvent = new window.MouseEvent('mousedown');

    testElement.getDOMNode().dispatchEvent(mouseEvent);

    // assures the dispatch event does indeed flip the state
    expect(state).to.equal(true);

    testElement.clear();
    
    testElement.getDOMNode().dispatchEvent(mouseEvent);

    // assures the event is still true after a clear
    expect(state).to.equal(true);

  });

});