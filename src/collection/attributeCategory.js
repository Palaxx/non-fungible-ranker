function getUniquenessScore(element) {
  return parseInt(
    ((this.elements[element] / this.elementCount) * 100 * 100).toFixed(0)
  )
}

function getOccurences(element) {
  return this.elements[element]
}

module.exports = (name) => {
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
    getElements: () => context.elements,
    getRarityScore: (element) => getUniquenessScore.call(context, element),
    getOccurences: (element) => getOccurences.call(context, element),
  }
}
