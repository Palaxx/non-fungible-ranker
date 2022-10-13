'use strict'

module.exports = (options, collection) => {
  let processor = null
  if (options.type === 'rarityScore') {
    processor = require('./rarityScoreProcessor')(collection)
  }

  processor.getCollectionScores = () => {
    const nft = collection.getNftIds()

    return nft.map((id) => {
      return { id, score: processor.getNftScore(id) }
    })
  }
  return processor
}
