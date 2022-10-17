'use strict'

const { Writable } = require('stream')
module.exports = (collection) => {
  return new Writable({
    objectMode: true,
    write(chunk, enc, next) {
      const attributes = chunk.content
      collection.setNft(chunk.id, chunk.content)
      for (const { trait_type, value } of attributes) {
        collection.addAttributeElement(trait_type, value)
      }
      next()
    },
  })
}
