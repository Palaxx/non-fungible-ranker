'use strict'
const { Writable } = require('stream')

const attributeFactory = require('./attribute')

module.exports = () => {
  const attributeMap = new Map()
  const nft = {}
  return {
    addEligibleAttribute: (attribute, weight = 1) => {
      attributeMap.set(attribute, attributeFactory(attribute, weight))
    },

    attributesMap: () => attributeMap,
    categories: () =>
      Object.values(Object.fromEntries(attributeMap))[0].getElements(),

    getNft: (id) => nft[id],
    getNftIds: () => Object.keys(nft),

    createWriteStream: () => {
      return new Writable({
        objectMode: true,
        write(chunk, enc, next) {
          const attributes = chunk.content
          nft[chunk.id] = chunk.content
          for (const { trait_type, value } of attributes) {
            if (attributeMap.has(trait_type)) {
              attributeMap.get(trait_type).addElement(value)
            }
          }
          next()
        },
      })
    },
  }
}
