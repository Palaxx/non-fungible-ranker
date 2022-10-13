'use strict'
const { Writable } = require('stream')

const attributeCategory = require('./attributeCategory')

module.exports = () => {
  const attributes = {}
  const categoriesMap = new Map()
  return {
    addEligibleAttribute: (attribute, weight = 1) => {
      attributes[attribute] = weight
      categoriesMap.set(attribute, attributeCategory(attribute))
    },

    attributes: () => Object.keys(attributes),
    categories: () =>
      Object.values(Object.fromEntries(categoriesMap))[0].getElements(),

    createWriteStream: () => {
      return new Writable({
        objectMode: true,
        write(chunk, enc, next) {
          const attributes = chunk.content
          for (const { trait_type, value } of attributes) {
            if (categoriesMap.has(trait_type)) {
              categoriesMap.get(trait_type).addElement(value)
            }
          }
          next()
        },
      })
    },
  }
}
