'use strict'

const { Readable } = require('stream')

const t = require('tap')

const filesystemReaderFactory = require('../../lib/readers/filesystemReader')

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
const fakeFolderContents = {
  '1.json': JSON.stringify(fakeContent1),
  '2.json': JSON.stringify(fakeContent2),
}
const fakeDir = t.testdir(fakeFolderContents)

t.test('It should throw error if path options not exists', async (t) => {
  const reader = filesystemReaderFactory({
    source: {},
  })

  t.throws(() => reader.validateOptions(), {
    message: 'path is a required option',
  })
})

t.test(
  'It should throw error if attributes options has no values',
  async (t) => {
    const reader = filesystemReaderFactory({
      source: { path: fakeDir },
    })

    t.throws(() => reader.validateOptions(), {
      message: 'At least one attribute should be received',
    })
  }
)

t.test('It should throw error if path folder does not exists', async (t) => {
  const reader = filesystemReaderFactory({
    source: { path: 'fake_dir' },
    collection: { attributes: ['Background', 'Skin'] },
  })

  t.rejects(() => reader.createReadStream(), {
    message: 'fake_dir is not a valid folder',
  })
})

t.test('It should read all the files of the path folder', (t) => {
  t.plan(2)
  const reader = filesystemReaderFactory({
    source: { path: fakeDir },
    collection: { attributes: ['Background', 'Skin'] },
  })

  reader.createReadStream().then((results) => {
    t.type(results, Readable)

    const records = {}
    results.on('data', ({ id, content }) => {
      records[id] = content
    })
    results.on('end', () => {
      t.strictSame(records, {
        '1.json': fakeContent1.attributes,
        '2.json': fakeContent2.attributes,
      })
    })
  })
})
