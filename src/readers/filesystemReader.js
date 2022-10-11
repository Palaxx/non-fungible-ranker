'use strict'

const fs = require('fs/promises')

function validateOptions(options) {
  if (!options?.path) {
    throw new Error('path is a required option')
  }
}

module.exports = (options) => {
  return {
    validateOptions: () => validateOptions(options),
    execute: async () => {
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

      const map = new Map()
      const files = await fs.readdir(path)

      for (const file of files) {
        if (file === 'metadata.json') {
          continue
        }
        const content = JSON.parse(await fs.readFile(`${path}/${file}`, 'utf8'))
        map.set(file, content.attributes)
      }
      return map
    },
  }
}
