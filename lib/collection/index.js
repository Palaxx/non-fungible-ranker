'use strict'

const attributeFactory = require('./attribute')

module.exports = (options) => {
  const supply = options?.supply ?? 0

  if (supply <= 0) {
    throw new Error(`Supply must be more then 1`)
  }

  const attributeMap = new Map()
  const nft = {}
  return {
    addEligibleAttribute: (attribute, weight = 1) => {
      attributeMap.set(attribute, attributeFactory(attribute, weight))
    },

    addAttributeElement: (attribute, element) => {
      if (attributeMap.has(attribute)) {
        attributeMap.get(attribute).addElement(element)
      }
    },

    getAttributeOccurrences: (attribute, element) => {
      if (!attributeMap.has(attribute)) {
        throw new Error(`Invalid attribute ${attribute}`)
      }
      return attributeMap.get(attribute).getOccurrences(element)
    },

    getEligibleAttributes: () => Array.from(attributeMap.keys()),

    supply: () => supply,
    setNft: (id, content) => {
      nft[id] = content
    },

    getNft: (id) => nft[id],
    getNftIds: () => Object.keys(nft),
  }
}
