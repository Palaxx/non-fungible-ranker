const { pipeline } = require('stream/promises')

const readerFactory = require('./src/readers')
const stats = require('./src/collection')()

module.exports = async function nftCollectionStats(options) {
  if (!options.reader) {
    throw new Error('No reader option received')
  }

  if (options.attributes?.length === 0) {
    throw new Error('At least one attribute should be received')
  }

  for (const attribute of options.attributes) {
    stats.addEligibleAttribute(attribute)
  }

  return {
    attributes: stats.attributes,
    calculateStats: async () => {
      const reader = readerFactory().make(options.reader, options)

      const rs = await reader.execute()
      const ws = await stats.createWriteStream()
      await pipeline(rs, ws)

      console.log('END')

      return stats.categories()
    },
  }
  // const reader = readers().make(options.reader, options)
  //
  // return reader.execute()
}
