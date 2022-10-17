'use strict'

const t = require('tap')

const rarityScoreRanker = require('../../lib/rankers/traitRarityRanker')

const fakeCollection = {
  getNft: (id) => {
    if (id === 1) {
      return [
        { trait_type: 'color', value: 'red' },
        { trait_type: 'background', value: 'blue' },
      ]
    }
    return [
      { trait_type: 'color', value: 'yellow' },
      { trait_type: 'background', value: 'green' },
    ]
  },

  supply: () => 10,

  getAttributeOccurrences: (attribute, element) => {
    const results = {
      color_red: 1,
      color_yellow: 5,
      background_blue: 2,
      background_green: 3,
    }

    return results[`${attribute}_${element}`]
  },
}

t.test('It should return right score when getNftScore is called', async () => {
  const ranker = rarityScoreRanker(fakeCollection)

  t.equals(ranker.getNftScore(1), 0.1)
  t.equals(ranker.getNftScore(2), 0.3)
})
