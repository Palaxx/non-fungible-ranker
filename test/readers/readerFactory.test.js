const t = require('tap')

const factory = require('../../src/readers')

const fakeReader = (options) => ({
  execute: () => options.result,
})

t.test('It should be able to create a filesystemReader', async (t) => {
  const readerFactory = factory()

  const reader = readerFactory.make('filesystem')
  t.ok(reader)
})

t.test(
  'It should be possible to add new reader and execute without validation',
  async (t) => {
    const readerFactory = factory()
    readerFactory.register('fakeReader', fakeReader)
    const reader = readerFactory.make('fakeReader', { result: true })
    t.ok(reader)
    t.ok(reader.execute())
  }
)

t.test(
  'It should throw error in case options is not valid for the new reader',
  async (t) => {
    const readerFactory = factory()
    const fakeReaderWithValidation = (options) => ({
      validateOptions: () => {
        if (options.wrongParameter) {
          throw new Error(`wrongParameter is not a valid parameter`)
        }
      },
      execute: () => options.result,
    })
    readerFactory.register('fakeReader', fakeReaderWithValidation)

    const reader = readerFactory.make('fakeReader', { result: true })
    t.ok(reader.execute())

    t.throws(() => readerFactory.make('fakeReader', { wrongParameter: true }), {
      message: `wrongParameter is not a valid parameter`,
    })
  }
)

t.test('It should throw error in case reader is register twice', async (t) => {
  const readerFactory = factory()
  readerFactory.register('fakeReader', () => {})
  t.throws(() => readerFactory.register('fakeReader', fakeReader), {
    message: `Can't register fakeReader twice`,
  })
})

t.test('It should throw error in case reader does not exists', async (t) => {
  const readerFactory = factory()
  readerFactory.register('fakeReader', fakeReader)
  t.throws(() => readerFactory.make('realReader'), {
    message: 'realReader is not a valid reader',
  })
})
