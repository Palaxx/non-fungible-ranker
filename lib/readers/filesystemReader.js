'use strict'

const fs = require('fs/promises')
const { Readable } = require('stream')

function validateOptions(sourceOptions, collectionOptions) {
  if (!sourceOptions.path) {
    throw new Error('path is a required option')
  }

  const attributes = collectionOptions?.attributes ?? []
  if (attributes.length === 0) {
    throw new Error('At least one attribute should be received')
  }
}

function createReadStream(files, path, eligibleAttribute) {
  return new Readable({
    objectMode: true,
    async read() {
      if (files.length === 0) {
        this.push(null)
      } else {
        const filename = files.shift()
        const content = JSON.parse(
          await fs.readFile(`${path}/${filename}`, 'utf8')
        )
        this.push({
          id: filename,
          content: content.attributes.filter((attribute) =>
            eligibleAttribute.includes(attribute.trait_type)
          ),
        })
      }
    },
  })
}

module.exports = (options) => {
  const { source: sourceOptions, collection: collectionOptions } = options
  return {
    validateOptions: () => validateOptions(sourceOptions, collectionOptions),
    createReadStream: async () => {
      const { path } = sourceOptions
      const { attributes } = collectionOptions

      let stats
      try {
        stats = await fs.stat(path)
      } catch (e) {
        // Do nothing
      }

      if (!stats || !stats.isDirectory()) {
        throw new Error(`${path} is not a valid folder`)
      }

      const files = (await fs.readdir(path)).filter(
        (filename) => filename !== 'metadata.json'
      )

      return createReadStream(files, path, attributes)
    },
  }
}
