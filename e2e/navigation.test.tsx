// Empty export forces file to be a module which TS requires with its current
// config. Note: This can be removed once something is being imported.
export {}

jest.setTimeout(30000)

describe('Experiments', () => {
  beforeAll(async () => {
    await page.goto('http://a8c-abacus-local:3000')
  })

  describe('from home page', () => {
    // In non-production contexts, we should see the main page immediately.
    it('should navigate to experiment details page on row click', async () => {
      // Rendering of the table is dynamic. That is, it is not rendered until the
      // experiment data loads, hence the reason for the wait.
      await page.waitForSelector('.MuiTableHead-root')

      // Click an experiment row.
      const $tableRows = await page.$$('.MuiTableBody-root .MuiTableRow-root')
      expect($tableRows.length).toBeGreaterThan(0)
      await Promise.all([page.waitForNavigation(), $tableRows[0].click()])

      // Assert clicking a row navigated to the details page of that experiment.
      expect(page.url()).toMatch(/^http:\/\/a8c-abacus-local:3000\/experiments\/\d+/)
    })
  })
})
