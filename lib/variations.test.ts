import * as Variations from './variations'

describe('lib/variations.ts module', () => {
  describe('getSortedVariations', () => {
    it('returns the variations sorted in the canonical order', () => {
      const sortedVariations = [
        {
          variationId: 1,
          name: 'control',
          isDefault: true,
          allocatedPercentage: 60,
        },
        {
          variationId: 3,
          name: 'test_a',
          isDefault: false,
          allocatedPercentage: 30,
        },
        {
          variationId: 2,
          name: 'test_b',
          isDefault: false,
          allocatedPercentage: 10,
        },
      ]

      expect(Variations.getSortedVariations(sortedVariations)).toEqual(sortedVariations)
      expect(Variations.getSortedVariations([sortedVariations[1], sortedVariations[0], sortedVariations[2]])).toEqual(
        sortedVariations,
      )
      expect(Variations.getSortedVariations([sortedVariations[2], sortedVariations[1], sortedVariations[0]])).toEqual(
        sortedVariations,
      )
    })
  })
})
