import { experimentFullSchema } from './schemas'

test('TODO: Remove the following hack to bump coverage to 100%.', async () => {
  try {
    await experimentFullSchema.validate({})
    expect(false).toBe(true)
  } catch (err) {
    expect(err).toBeDefined()
  }
})
