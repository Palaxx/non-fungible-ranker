'use strict'

function addProcessor(processors, name, resolver) {
  if (processors[name]) {
    throw new Error(`Can't register processor ${name} twice`)
  }
  processors[name] = resolver
}

function decorate(processor, collection) {
  processor.getCollectionScores = () => {
    const nft = collection.getNftIds()

    return nft.map((id) => {
      return { id, score: processor.getNftScore(id) }
    })
  }
}

module.exports = (collection) => {
  const processors = {}

  addProcessor(processors, 'rarityScore', require('./rarityScoreProcessor'))

  return {
    make: (name, options) => {
      name = name ?? 'rarityScore'

      if (!processors[name]) {
        throw new Error(`${name} is not a valid processor`)
      }

      const processor = processors[name](collection, options)

      decorate(processor, collection)

      return processor
    },

    register: (name, resolver) => addProcessor(processors, name, resolver),
  }
}
