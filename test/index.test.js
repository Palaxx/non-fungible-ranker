const t = require('tap')

const nftCollectionStats = require('../lib/index')

t.test(
  'It should throw an error in case no reader option is received',
  async (t) => {
    t.rejects(() => nftCollectionStats({}), {
      message: 'No reader option received',
    })
  }
)

t.test('It should be at least 1 eligible attributes', async (t) => {
  t.rejects(() => nftCollectionStats({ reader: 'xxx', attributes: [] }), {
    message: 'At least one attribute should be received',
  })
})

t.test('It should add attribute as eligible in stats module', async (t) => {
  const stats = await nftCollectionStats({
    reader: 'xxx',
    attributes: ['field1', 'field2'],
  })
  t.equals(2, Array.from(stats.getCollection().attributesMap().keys()).length)
})
