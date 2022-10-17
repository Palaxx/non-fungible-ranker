'use strict'

module.exports = (collection, options = {}) => ({
  getNftScore: (nftId) => {
    const nftAttributes = collection.getNft(nftId)
    const supply = collection.supply()
    const occurrences = nftAttributes.map(({ trait_type, value }) =>
      collection.getAttributeOccurrences(trait_type, value)
    )

    let rarityScore = 0

    for (let i = 0; i < occurrences.length; i++) {
      rarityScore += 1 / (occurrences[i] / supply)
    }

    return rarityScore
  },
})
