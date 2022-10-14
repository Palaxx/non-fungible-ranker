'use strict'
const { Writable } = require('stream')

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

    attributesMap: () => attributeMap,

    supply: () => supply,
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
