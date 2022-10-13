'use strict'

const { pipeline } = require('stream/promises')

const readersContainer = require('./readers')
const collectionFactory = require('./collection')
const processorFactory = require('./processors')

module.exports = async function nftCollectionStats(options) {
  if (!options.reader) {
    throw new Error('No reader option received')
  }

  const attributes = options?.attributes ?? []
  if (attributes.length === 0) {
    throw new Error('At least one attribute should be received')
  }

  const readerFactory = readersContainer()
  const collection = collectionFactory()

  for (const attribute of options.attributes) {
    collection.addEligibleAttribute(attribute)
  }

  return {
    getCollection: () => collection,

    registerNewReader: (name, reader) =>
      readerFactory.registerNewReader(name, reader),

    calculateStats: async () => {
      const reader = readerFactory.make(options.reader, options)

      const rs = await reader.createReadStream()
      const ws = await collection.createWriteStream()
      await pipeline(rs, ws)

      const processor = processorFactory(
        {
          type: 'rarityScore',
        },
        collection
      )

      return processor.getCollectionScores()
    },
  }
}
