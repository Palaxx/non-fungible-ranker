'use strict'

const t = require('tap')

const averageTraitRanker = require('../../lib/rankers/averageRanker')

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
  const ranker = averageTraitRanker(fakeCollection)

  t.equals(ranker.getNftScore(1).toFixed(2), (0.15).toFixed(2))
  t.equals(ranker.getNftScore(2).toFixed(2), (0.4).toFixed(2))
})
