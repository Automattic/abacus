import { MetricParameterType } from 'src/lib/schemas'

import { formatBoolean, formatMetricValue } from './formatters'

describe('utils/formatters.ts module', () => {
  describe('formatBoolean', () => {
    it('should format true as Yes', () => {
      expect(formatBoolean(true)).toBe('Yes')
    })

    it('should format true as No', () => {
      expect(formatBoolean(false)).toBe('No')
    })
  })

  describe('formatMetricValueUnit', () => {
    it('should format values correctly', () => {
      expect(formatMetricValue(1, MetricParameterType.Conversion)).toBe('100%')
      expect(formatMetricValue(0.01, MetricParameterType.Conversion)).toBe('1%')
      expect(formatMetricValue(1, MetricParameterType.Conversion, true)).toBe('100 percentage points')
      expect(formatMetricValue(0.01, MetricParameterType.Conversion, true)).toBe('1 percentage points')

      expect(formatMetricValue(1, MetricParameterType.Revenue)).toBe('$1')
      expect(formatMetricValue(0.01, MetricParameterType.Revenue)).toBe('$0.01')
      expect(formatMetricValue(1, MetricParameterType.Revenue, true)).toBe('$1')
      expect(formatMetricValue(0.01, MetricParameterType.Revenue, true)).toBe('$0.01')
    })
  })
})
