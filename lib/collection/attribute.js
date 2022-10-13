function getOccurences(element) {
  return this.elements[element]
}

function getElements() {
  return this.elements
}
module.exports = (name, weight) => {
  const context = {
    elements: {},
    elementCount: 0,
  }
  return {
    getName: () => {
      return name
    },
    addElement: (element) => {
      if (!context.elements[element]) {
        context.elements[element] = 0
      }
      context.elements[element]++
      context.elementCount++
    },
    getElements: () => getElements.call(context),
    getElementsCount: () => getElements.call(context).length,
    getOccurences: (element) => getOccurences.call(context, element),
  }
}
