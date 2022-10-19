'use strict'

function addRanker(rankers, name, resolver) {
  if (rankers[name]) {
    throw new Error(`Can't register ranker ${name} twice`)
  }
  rankers[name] = resolver
}

function decorate(ranker, collection) {
  ranker.getCollectionScores = () => {
    const nft = collection.getNftIds()

    return nft.map((id) => {
      return { id, score: ranker.getNftScore(id) }
    })
  }
}

module.exports = (collection) => {
  const rankers = {}

  addRanker(rankers, 'rarityScore', require('./rarityScoreRanker'))
  addRanker(rankers, 'traitRarity', require('./traitRarityRanker'))
  addRanker(rankers, 'averageTraitRarity', require('./averageRanker'))
  addRanker(rankers, 'statisticalRarity', require('./statisticalRanker'))

  return {
    make: (name, options) => {
      name = name ?? 'rarityScore'

      if (!rankers[name]) {
        throw new Error(`${name} is not a valid ranker`)
      }

      const ranker = rankers[name](collection, options)

      decorate(ranker, collection)

      return ranker
    },

    register: (name, resolver) => addRanker(rankers, name, resolver),
  }
}
