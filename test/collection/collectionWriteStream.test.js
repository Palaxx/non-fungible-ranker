'use strict'

const t = require('tap')

const collectionWriteStream = require('../../lib/collection/collectionWriteStream')

const countElementArray = (array, searched) =>
  array.filter((el) => el === searched).length
t.test('Using writable stream should fill the collection', async (t) => {
  const setsNft = []
  const attributeElementAdded = []
  const collection = {
    addAttributeElement: (attribute, element) => {
      attributeElementAdded.push(`${attribute}_${element}`)
    },
    setNft: (id, content) => {
      setsNft.push(id)
    },
  }
  const ws = collectionWriteStream(collection)

  ws.write({
    id: 1,
    content: [
      {
        trait_type: 'color',
        value: 'red',
      },
      {
        trait_type: 'background',
        value: 'red',
      },
    ],
  })

  ws.write({
    id: 2,
    content: [
      {
        trait_type: 'color',
        value: 'red',
      },
      {
        trait_type: 'background',
        value: 'blue',
      },
    ],
  })

  ws.end()

  t.same(setsNft, [1, 2])
  t.equals(countElementArray(attributeElementAdded, 'color_red'), 2)
  t.equals(countElementArray(attributeElementAdded, 'background_red'), 1)
  t.equals(countElementArray(attributeElementAdded, 'background_blue'), 1)
  t.equals(countElementArray(attributeElementAdded, 'background_yellow'), 0)
})
