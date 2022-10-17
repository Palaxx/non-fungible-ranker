'use strict'

const { pipeline } = require('stream/promises')

const readersContainer = require('./readers')
const collectionFactory = require('./collection')
const collectionWriteStream = require('./collection/collectionWriteStream')
const rankersContainer = require('./rankers')

module.exports = function nonFungibleRanker(options) {
  const {
    source: sourceOptions,
    collection: collectionOptions,
    ranker: rankerOptions,
  } = options
  if (!sourceOptions?.type) {
    throw new Error('No source type received')
  }

  const attributes = collectionOptions?.attributes ?? []

  if (attributes.length === 0) {
    throw new Error('At least one attribute should be received')
  }

  const readerFactory = readersContainer()
  const collection = collectionFactory(collectionOptions)

  for (const attribute of collectionOptions.attributes) {
    collection.addEligibleAttribute(attribute)
  }

  return {
    getCollection: () => collection,

    registerNewReader: (name, reader) =>
      readerFactory.registerNewReader(name, reader),

    rankCollection: async () => {
      const reader = readerFactory.make(sourceOptions.type, options)

      const rs = await reader.createReadStream()
      const ws = await collectionWriteStream(collection)
      await pipeline(rs, ws)

      const rankerFactory = rankersContainer(collection)

      const ranker = rankerFactory.make(rankerOptions?.type, rankerOptions)

      return ranker.getCollectionScores()
    },
  }
}
