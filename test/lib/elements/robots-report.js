
import { expect } from 'chai';

import robotsReporter from 'elements/robots-reporter';

describe('robots', () => {
  
  let robotsReporterElement;

  before(() => {
    
    if (robotsReporterElement) {
      robotsReporterElement.clear();
    }

    robotsReporterElement = robotsReporter(document.createElement('ul'));

  });

  it('should return the robots element', () => {

    const node = robotsReporterElement.getDOMNode();

    expect(node.nodeName).to.equal('UL');

  });

  it('should add 1 robot with text', () => {

    robotsReporterElement.addRobot({x: 1, y: 1}, 'W');

    const node = robotsReporterElement.getDOMNode();

    expect(node.children.length).to.equal(1);
    expect(/^\s*$/.test(node.children[0].innerHTML)).to.equal(false);

  });

});