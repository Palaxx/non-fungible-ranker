'use strict'

const { pipeline } = require('stream/promises')

const readersContainer = require('./readers')
const collectionFactory = require('./collection')

module.exports = async function nftCollectionStats(options) {
  if (!options.reader) {
    throw new Error('No reader option received')
  }

  if (options.attributes?.length === 0) {
    throw new Error('At least one attribute should be received')
  }

  const readerFactory = readersContainer()
  const collection = collectionFactory()

  for (const attribute of options.attributes) {
    collection.addEligibleAttribute(attribute)
  }

  return {
    attributes: collection.attributes,

    registerNewReader: (name, reader) =>
      readerFactory.registerNewReader(name, reader),

    calculateStats: async () => {
      const reader = readerFactory.make(options.reader, options)

      const rs = await reader.execute()
      const ws = await collection.createWriteStream()
      await pipeline(rs, ws)

      console.log('END')

      return collection.categories()
    },
  }
  // const reader = readers().make(options.reader, options)
  //
  // return reader.execute()
}
