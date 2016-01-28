
import createReport from '../helpers/create-report';
import element from '../helpers/element';

export default (node) => {

  const robotMethods = {

    addListElement (reportText) {

      const listElement = document.createElement('li');
      listElement.innerHTML = reportText;

      this.getDOMNode().appendChild(listElement);

    },

    addRobot () {

      const reportText = createReport.apply(this, arguments);

      this.addListElement(reportText);
      
    }

  };

  const robotElement = Object.assign({}, element(node), robotMethods);

  return robotElement;

};