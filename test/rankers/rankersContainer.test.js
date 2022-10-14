'use strict'

const t = require('tap')

const container = require('../../lib/rankers')

const fakeRanker = () => ({
  getNftScore: (id) => id,
})

const fakeCollection = {}

t.test('It should be able to create a rarityScoreRanker', async (t) => {
  const factory = t.mock('../../lib/rankers', {
    '../../lib/rankers/rarityScoreRanker': () => () => ({}),
  })

  const reader = factory(fakeCollection).make('rarityScore')
  t.ok(reader)
})

t.test('It should be possible to add new ranker', async (t) => {
  const fakeCollection = {
    getNftIds: () => [1, 2, 3],
  }
  const fakeRanker = () => ({
    getNftScore: (id) => {
      return id * 2
    },
  })
  const rankerContainer = container(fakeCollection)
  rankerContainer.register('fakeRanker', fakeRanker)
  const ranker = rankerContainer.make('fakeRanker', {})
  t.ok(ranker)

  const results = ranker.getCollectionScores()
  t.strictSame(results, [
    { id: 1, score: 2 },
    { id: 2, score: 4 },
    { id: 3, score: 6 },
  ])
})

t.test('It should throw error in case ranker is register twice', async (t) => {
  const rankerContainer = container()
  rankerContainer.register('fakeRanker', () => {})
  t.throws(() => rankerContainer.register('fakeRanker', fakeRanker), {
    message: `Can't register ranker fakeRanker twice`,
  })
})

t.test('It should throw error in case ranker does not exists', async (t) => {
  const rankerContainer = container()
  rankerContainer.register('fakeRanker', fakeRanker)
  t.throws(() => rankerContainer.make('realRanker'), {
    message: 'realRanker is not a valid ranker',
  })
})
