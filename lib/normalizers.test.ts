import * as Normalizers from './normalizers'

describe('lib/normalizers.ts module', () => {
  describe('indexSegments', () => {
    it('indexes an empty array', () => {
      expect(Normalizers.indexMetrics([])).toMatchObject({})
    })
    it('indexes an non-empty array', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      expect(Normalizers.indexMetrics([{ metricId: 1 }])).toMatchObject({ 1: { metricId: 1 } })
    })
  })

  describe('indexSegments', () => {
    it('indexes an empty array', () => {
      expect(Normalizers.indexSegments([])).toMatchObject({})
    })
    it('indexes an non-empty array', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      expect(Normalizers.indexSegments([{ segmentId: 1 }])).toMatchObject({ 1: { segmentId: 1 } })
    })
  })
})
