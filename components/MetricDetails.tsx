/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'

import BooleanText from '@/components/BooleanText'
import { MetricFull } from '@/models'

/**
 * Renders the metric details.
 */
const MetricDetails = (props: { metric: MetricFull }) => {
  const { metric } = props
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>
              <label>Name</label>
            </td>
            <td>{metric.name}</td>
          </tr>
          <tr>
            <td>
              <label>Description</label>
            </td>
            <td>{metric.description}</td>
          </tr>
          <tr>
            <td>
              <label>Higher Is Better?</label>
            </td>
            <td>
              <BooleanText value={metric.higherIsBetter} />
            </td>
          </tr>
          {metric.eventParams && (
            <tr>
              <td>
                <label>Event Parameters</label>
              </td>
              <td>
                <pre>{JSON.stringify(metric.eventParams, null, 2)}</pre>
              </td>
            </tr>
          )}
          {metric.revenueParams && (
            <tr>
              <td>
                <label>Revenue Parameters</label>
              </td>
              <td>
                <pre>{JSON.stringify(metric.revenueParams, null, 2)}</pre>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default MetricDetails
