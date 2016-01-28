
function clearEventListeners (node) {

  const clone = node.cloneNode(true /* deep clone */);

  if (node.parentNode) {

    node.parentNode.replaceChild(clone, node);

  }

  node = null; // for good measure

  return clone;

}

export default (node) => {

  let DOMNode = node;

  return {

    getDOMNode () {

      return DOMNode;

    },

    clear () {

      DOMNode = clearEventListeners(DOMNode);
      DOMNode.innerHTML = '';
      
    }

  };

};