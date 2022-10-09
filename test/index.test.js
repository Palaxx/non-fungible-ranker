const t = require('tap')

const nftCollectionStats = require('../index')

t.test(
  'It should throw an error in case no reader option is received',
  async (t) => {
    t.throw(() => nftCollectionStats({}), {
      message: 'No reader option received',
    })
  }
)
