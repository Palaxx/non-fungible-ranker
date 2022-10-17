const t = require('tap')

const nftCollectionStats = require('../lib/index')

t.test(
  'It should throw an error in case no reader option is received',
  async (t) => {
    t.throws(() => nftCollectionStats({}), {
      message: 'No source type received',
    })
  }
)

t.test('It should be at least 1 eligible attributes', async (t) => {
  t.throws(
    () =>
      nftCollectionStats({
        source: { type: 'xxx' },
        collection: { attributes: [] },
      }),
    {
      message: 'At least one attribute should be received',
    }
  )
})

t.test('It should add attribute as eligible in stats module', async (t) => {
  const stats = nftCollectionStats({
    source: { type: 'xxx' },
    collection: { attributes: ['field1', 'field2'], supply: 1 },
  })
  t.equals(2, stats.getCollection().getEligibleAttributes().length)
})

t.test('It should set supply to the collection', async (t) => {
  const stats = nftCollectionStats({
    source: { type: 'xxx' },
    collection: { attributes: ['field1', 'field2'], supply: 131 },
  })
  t.equals(stats.getCollection().supply(), 131)
})
