'use strict'

const t = require('tap')

const attributeFactory = require('../../lib/collection/attribute')

t.test('Name and weight should be returned', async (t) => {
  const attribute = attributeFactory('testAttribute', 3)
  t.equals(attribute.name(), 'testAttribute')
  t.equals(attribute.weight(), 3)
})

t.test('Adding an element should increment total count', async (t) => {
  const attribute = attributeFactory('testAttribute', 3)

  attribute.addElement('fake-element-1')
  t.equals(attribute.getElementsCount(), 1)

  attribute.addElement('fake-element-2')
  attribute.addElement('fake-element-3')
  attribute.addElement('fake-element-3')
  t.equals(attribute.getElementsCount(), 4)
})

t.test(
  'Adding an element should increment count of the single element',
  async (t) => {
    const attribute = attributeFactory('testAttribute', 3)

    attribute.addElement('fake-element-1')
    t.equals(attribute.getOccurrences('fake-element-1'), 1)

    attribute.addElement('fake-element-1')
    t.equals(attribute.getOccurrences('fake-element-1'), 2)

    attribute.addElement('fake-element-3')
    attribute.addElement('fake-element-3')
    t.equals(attribute.getOccurrences('fake-element-3'), 2)
    t.equals(
      attribute.getOccurrences('fake-element-not-exists'),
      0,
      '0 should be returned when queried with non existence element'
    )
  }
)

t.test('Adding an element should change elements object', async (t) => {
  const attribute = attributeFactory('testAttribute', 3)

  attribute.addElement('fake-element-1')
  attribute.addElement('fake-element-2')
  attribute.addElement('fake-element-3')
  attribute.addElement('fake-element-3')

  t.strictSame(attribute.getElements(), {
    'fake-element-1': 1,
    'fake-element-2': 1,
    'fake-element-3': 2,
  })
})
