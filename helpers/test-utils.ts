import mediaQuery from 'css-mediaquery'

/**
 * Create a `matchMedia` function that will match a query based on the specified
 * width.
 *
 *     const initialJsDomWindowInnerWidth = window.innerWidth
 *     afterEach(() => {
 *       // Reset back to initial width for tests that don't explicitly set the width
 *       // themselves.
 *       window.matchMedia = createMatchMedia(initialJsDomWindowInnerWidth)
 *     })
 *
 *     test('...', () => {
 *       window.matchMedia = createMatchMedia(600)
 *       ...
 *     })
 *
 * @param width - The width of the window to simulate.
 */
function createMatchMedia(width: number) {
  return (query: string) => ({
    matches: mediaQuery.match(query, { width }),
    media: query,
    addEventListener: jest.fn(),
    addListener: jest.fn(),
    dispatchEvent: jest.fn(),
    onchange: jest.fn(),
    removeEventListener: jest.fn(),
    removeListener: jest.fn(),
  })
}

export { createMatchMedia }
