import { MetricBare } from './schemas'

export function getUnit<Metric extends MetricBare>(metric: Metric) {
  return metric.parameterType === 'conversion' ? 'conversions' : 'USDs'
}
