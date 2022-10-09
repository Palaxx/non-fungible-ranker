'use strict'

function addReader(readers, name, resolver) {
  if (readers[name]) {
    throw new Error(`Can't register ${name} twice`)
  }
  readers[name] = resolver
}

function make(readers, name, options) {
  if (!readers[name]) {
    throw new Error(`${name} is not a valid reader`)
  }

  const reader = readers[name](options)
  if (typeof reader.validateOptions === 'function') {
    reader.validateOptions()
  }
  return reader
}

module.exports = () => {
  const readers = {}

  addReader(readers, 'filesystem', require('./filesystemReader'))

  return {
    make: (name, options) => make(readers, name, options),
    register: (name, resolver) => addReader(readers, name, resolver),
  }
}
