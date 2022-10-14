'use strict'

function getUniquenessScore(collectionAttribute, element) {
  return parseInt(
    (
      (collectionAttribute.getOccurrences(element) /
        collectionAttribute.getElementsCount()) *
      100 *
      100
    ).toFixed(0)
  )
}

module.exports = (collection) => ({
  getNftScore: (nftId) => {
    const collectionAttributes = collection.attributesMap()
    const nftAttributes = collection.getNft(nftId)

    const scores = nftAttributes.map(({ trait_type, value }) => {
      const collectionAttribute = collectionAttributes.get(trait_type)
      return {
        score: getUniquenessScore(collectionAttribute, value),
        occurencies: collectionAttribute.getOccurrences(value),
      }
    })

    let rarityScore = 0

    for (let i = 0; i < scores.length; i++) {
      rarityScore += 1 / scores[i].occurencies / 10000
    }

    return rarityScore
  },
})
