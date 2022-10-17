'use strict'

module.exports = (collection, options = {}) => ({
  getNftScore: (nftId) => {
    const nftAttributes = collection.getNft(nftId)
    const supply = collection.supply()
    return nftAttributes
      .map(
        ({ trait_type, value }) =>
          collection.getAttributeOccurrences(trait_type, value) / supply
      )
      .reduce((prev, current) => {
        return current < prev ? current : prev
      }, 1)
  },

  name: 'traitRarity',
})
