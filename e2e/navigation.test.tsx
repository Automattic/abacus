// Empty export forces file to be a module which TS requires with its current
// config. Note: This can be removed once something is being imported.
export {}

page.setDefaultNavigationTimeout(300000)

describe('Dashboard', () => {
  // This test is disabled as it is susceptible to race conditions
  xit('should redirect to /experiments', async () => {
    await page.goto('http://a8c-abacus-local:3001')

    // Sometimes the redirect has not occurred yet. So, we need to wait.
    if (new URL(page.url()).pathname === '/') {
      await page.waitForNavigation({ timeout: 2000 })
    }

    expect(new URL(page.url()).pathname).toBe('/experiments')
  })
})

describe('Experiments', () => {
  beforeAll(async () => {
    await page.goto('http://a8c-abacus-local:3001/experiments')
  })

  describe('from experiments table', () => {
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
      expect(page.url()).toMatch(/^http:\/\/a8c-abacus-local:3001\/experiments\/\d+/)
    })
  })
})

describe('Experiment Creation', () => {
  describe('from experiments creation', () => {
    it('should render', async () => {
      await page.goto('http://a8c-abacus-local:3001/experiments/new')
      expect(page.url()).toMatch(/^http:\/\/a8c-abacus-local:3001\/experiments\/new/)
      await page.waitForSelector('h4')
      expect(/Design and Document Your Experiment/.exec(await page.content())).not.toBeNull()
    })
  })
})

describe('Metrics', () => {
  describe('from Metrics table', () => {
    it('should show metric details on row click', async () => {
      await page.goto('http://a8c-abacus-local:3001/metrics')

      await page.waitForSelector('.MuiTableHead-root')

      const $tableRows = await page.$$('.MuiTableBody-root tr')
      expect($tableRows.length).toBeGreaterThan(0)
      await $tableRows[0].click()
      await page.waitForSelector('.MuiTableBody-root .MuiTableBody-root')
      expect(await page.content()).toMatch(/Higher is Better/)
    })
  })
})
