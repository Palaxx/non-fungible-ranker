'use strict'

const fs = require('fs/promises')
const { Readable } = require('stream')

function validateOptions(options) {
  if (!options?.path) {
    throw new Error('path is a required option')
  }
}

function createReadStream(files, path) {
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
        this.push({ id: filename, content: content.attributes })
      }
    },
  })
}

module.exports = (options) => {
  return {
    validateOptions: () => validateOptions(options),
    createReadStream: async () => {
      const { path } = options

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

      return createReadStream(files, path)
    },
  }
}
