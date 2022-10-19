const t = require('tap')

const nonFungibleRanker = require('../lib/index')
const fakeContent1 = {
  attributes: [
    {
      trait_type: 'Background',
      value: 'Beige',
    },
    {
      trait_type: 'Skin',
      value: 'Spotted',
    },
  ],
}
const fakeContent2 = {
  attributes: [
    {
      trait_type: 'Background',
      value: 'Azure',
    },
    {
      trait_type: 'Skin',
      value: 'Red',
    },
  ],
}
const fakeContent3 = {
  attributes: [
    {
      trait_type: 'Background',
      value: 'Azure',
    },
    {
      trait_type: 'Skin',
      value: 'Purple',
    },
  ],
}
const fakeFolderContents = {
  '1.json': JSON.stringify(fakeContent1),
  '2.json': JSON.stringify(fakeContent2),
  '3.json': JSON.stringify(fakeContent3),
}
const fakeDir = t.testdir(fakeFolderContents)

t.test(
  'It should throw an error in case no reader option is received',
  async (t) => {
    t.throws(() => nonFungibleRanker({}), {
      message: 'No source type received',
    })
  }
)

t.test('It should be at least 1 eligible attributes', async (t) => {
  t.throws(
    () =>
      nonFungibleRanker({
        source: { type: 'xxx' },
        collection: { attributes: [] },
      }),
    {
      message: 'At least one attribute should be received',
    }
  )
})

t.test('It should add attribute as eligible in stats module', async (t) => {
  const stats = nonFungibleRanker({
    source: { type: 'xxx' },
    collection: { attributes: ['field1', 'field2'], supply: 1 },
  })
  t.equals(2, stats.getCollection().getEligibleAttributes().length)
})

t.test('It should set supply to the collection', async (t) => {
  const stats = nonFungibleRanker({
    source: { type: 'xxx' },
    collection: { attributes: ['field1', 'field2'], supply: 131 },
  })
  t.equals(stats.getCollection().supply(), 131)
})

t.test('It should rank a collection', async (t) => {
  const ranker = nonFungibleRanker({
    source: { type: 'filesystem', path: fakeDir },
    collection: { attributes: ['Background', 'Skin'], supply: 3 },
    ranker: { type: 'averageTraitRarity' },
  })
  const result = await ranker.rankCollection()

  t.strictSame(
    result.map((el) => ({
      id: el.id,
      score: parseFloat(el.score.toFixed(2)),
    })),
    [
      { id: '1.json', score: 0.33 },
      { id: '2.json', score: 0.5 },
      { id: '3.json', score: 0.5 },
    ]
  )
})

t.test('Should be possible to register and use new ranker', async (t) => {
  const ranker = nonFungibleRanker({
    source: { type: 'filesystem', path: fakeDir },
    collection: { attributes: ['Background', 'Skin'], supply: 3 },
    ranker: { type: 'customRanker' },
  })

  ranker.registerRanker('customRanker', (collection) => ({
    getNftScore: (nftId) => parseInt(nftId.replace('.json', '')),
  }))

  const result = await ranker.rankCollection()

  t.strictSame(
    result.map((el) => ({
      id: el.id,
      score: parseFloat(el.score.toFixed(2)),
    })),
    [
      { id: '1.json', score: 1 },
      { id: '2.json', score: 2 },
      { id: '3.json', score: 3 },
    ]
  )
})
