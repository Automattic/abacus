import { isTestingProductionConfigInDevelopment } from './config'

describe('/config', () => {
  it(`should not be using production config in development mode`, () => {
    expect(isTestingProductionConfigInDevelopment).toBe(false)
  })
})
