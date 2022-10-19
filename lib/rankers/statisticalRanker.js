'use strict'

module.exports = (collection, options = {}) => ({
  getNftScore: (nftId) => {
    const nftAttributes = collection.getNft(nftId)
    const possibility = nftAttributes.map(
      ({ trait_type, value }) =>
        collection.getAttributeOccurrences(trait_type, value) /
        collection.supply()
    )

    let statisticalScore = 1

    for (let i = 0; i < possibility.length; i++) {
      statisticalScore *= possibility[i]
    }

    return statisticalScore
  },

  name: 'average',
})
