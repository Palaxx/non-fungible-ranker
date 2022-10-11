'use strict'

const t = require('tap')

const filesystemReaderFactory = require('../../src/readers/filesystemReader')

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
  const reader = filesystemReaderFactory({})

  t.throws(() => reader.validateOptions(), {
    message: 'path is a required option',
  })
})

t.test('It should throw error if path folder does not exists', async (t) => {
  const reader = filesystemReaderFactory({
    path: 'fake_dir',
  })

  t.rejects(() => reader.execute(), {
    message: 'fake_dir is not a valid folder',
  })
})

t.test('It should read all the files of the path folder', async (t) => {
  const reader = filesystemReaderFactory({
    path: fakeDir,
  })

  const results = await reader.execute()

  t.type(results, Map)

  t.strictSame(Object.fromEntries(results), {
    '1.json': fakeContent1.attributes,
    '2.json': fakeContent2.attributes,
  })
})
