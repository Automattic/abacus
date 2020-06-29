// Empty export forces file to be a module which TS requires with its current
// config. Note: This can be removed once something is being imported.
export {}

jest.setTimeout(90000)

describe('Experiments', () => {
  // Temporarily disabled until we decide how to test the full auth flow.
  xit('should display "Abacus - Testing" text on page from WordPress.com.', async () => {
    await page.goto('http://a8c-abacus-local:3001')
    // This is because we expect that the user has not authenticated yet and they
    // should be redirected to the WP.com log-in page.
    expect(page.url()).toMatch(/^https:\/\/wordpress.com\/log-in/)
    await expect(page).toMatch('Abacus - Testing')
  })

  // In non-production contexts, we should see the main page immediately.
  it('should skip authentication and show the main page.', async () => {
    await page.goto('http://a8c-abacus-local:3001')

    // Sometimes the redirect has not occurred yet. So, we need to wait.
    if (new URL(page.url()).pathname === '/') {
      await page.waitForNavigation({ timeout: 2000 })
    }

    // We should arrive at the '/experiments' list
    expect(new URL(page.url()).pathname).toBe('/experiments')
    await expect(page.title()).resolves.toMatch('Experiments | Abacus')
    // TODO: make more interesting assertions once there is more content to display
  })
})
