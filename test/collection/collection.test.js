'use strict'

const t = require('tap')

const collectionFactory = require('../../lib/collection/index')

t.test('Should throw exception if supply is 0', async (t) => {
  t.throws(() => collectionFactory(), {
    message: `Supply must be more then 1`,
  })
})

t.test('Adding eligible attribute should add right attribute', async (t) => {
  const collectionFactory = t.mock('../../lib/collection/index', {
    '../../lib/collection/attribute': (attribute) => {
      if (attribute === 'fakeAttribute') {
        t.pass('fakeAttribute should be created')
        return
      }
      t.fail('Should not create attribute different by fakeAttribute')
    },
  })

  const collection = collectionFactory({ supply: 100 })
  collection.addEligibleAttribute('fakeAttribute')

  t.same(collection.getEligibleAttributes(), ['fakeAttribute'])

  t.equals(collection.supply(), 100)
})

t.test('Should be possible to add nft', async (t) => {
  const collection = collectionFactory({ supply: 100 })
  const redNft = [{ trait_type: 'color', value: 'red' }]
  const yellowNft = [{ trait_type: 'color', value: 'yellow' }]
  collection.setNft(1, redNft)
  collection.setNft(4, yellowNft)

  t.strictSame(collection.getNftIds(), ['1', '4'])
  t.strictSame(collection.getNft(1), redNft)
  t.strictSame(collection.getNft(4), yellowNft)
})
