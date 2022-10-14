function getOccurrences(element) {
  return this.elements[element] ?? 0
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
    name: () => name,
    weight: () => weight,
    addElement: (element) => {
      if (!context.elements[element]) {
        context.elements[element] = 0
      }
      context.elements[element]++
      context.elementCount++
    },
    getElements: () => getElements.call(context),
    getElementsCount: () => context.elementCount,
    getOccurrences: (element) => getOccurrences.call(context, element),
  }
}
