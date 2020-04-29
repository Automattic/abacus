// Empty export forces file to be a module which TS requires with its current
// config. Note: This can be removed once something is being imported.
export {}

describe('Abacus', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000')
  })

  it('should display "Experiments" text on page', async () => {
    await expect(page).toMatch('Experiments')
  })
})
