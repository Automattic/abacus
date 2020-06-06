import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Paper from '@material-ui/core/Paper'
import debugFactory from 'debug'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { toIntOrNull } from 'qc-to_int'

import { ExperimentsApi, MetricsApi, SegmentsApi } from '@/api'
import AttributionWindow from '@/components/AttributionWindow'
import BooleanText from '@/components/BooleanText'
import DatetimeText from '@/components/DatetimeText'
import ErrorsBox from '@/components/ErrorsBox'
import Layout from '@/components/Layout'
import MetricDetails from '@/components/MetricDetails'
import MetricMinimumDifference from '@/components/MetricMinimumDifference'
import {
  AttributionWindowSeconds,
  ExperimentFull,
  MetricFull,
  Segment,
  SegmentAssignment,
  SegmentType,
  Variation,
  MetricAssignment,
} from '@/models'

const debug = debugFactory('abacus:pages/experiments/[id].tsx')

interface MetricAssignmentsRowData {
  attributionWindowSeconds: AttributionWindowSeconds
  changeExpected: boolean
  isPrimary: boolean
  metric?: MetricFull
  metricAssignmentId: number
  minDifference: number
}

function toMetricAssignmentsRowData(metricAssignments: MetricAssignment[], metrics: MetricFull[]) {
  console.log('toMetricAssignmentsRowData', metricAssignments, metrics)
  const metricAssignmentsRowData: MetricAssignmentsRowData[] = metricAssignments.map((metricAssignment) => ({
    attributionWindowSeconds: metricAssignment.attributionWindowSeconds,
    changeExpected: metricAssignment.changeExpected,
    isPrimary: metricAssignment.isPrimary,
    metric: metrics.find((metric) => metric.metricId === metricAssignment.metricId),
    metricAssignmentId: metricAssignment.metricAssignmentId || -1, // Forces to a number to make TS happy.
    minDifference: metricAssignment.minDifference,
  }))

  return metricAssignmentsRowData
}

function toSegmentsByType(segmentAssignments: SegmentAssignment[], segmentsLut: Segment[]) {
  const segmentsByType: { [SegmentType.Country]: Segment[]; [SegmentType.Locale]: Segment[] } = {
    [SegmentType.Country]: [],
    [SegmentType.Locale]: [],
  }
  segmentAssignments.forEach((segmentAssignment) => {
    const segment = segmentsLut.find((segment) => segment.segmentId === segmentAssignment.segmentId)
    if (segment) {
      const { type } = segment
      const segments = segmentsByType[type]
      segments.push(segment)
      segmentsByType[type] = segments
    } else {
      console.error(`Unable to lookup segment with ID ${segmentAssignment.segmentId}.`)
    }
  })
  return segmentsByType
}

function MetricAssignmentsTable(props: { metricAssignmentsRowData: MetricAssignmentsRowData[] }) {
  const [selectedMetric, setSelectedMetric] = useState<MetricFull | null>(null)
  const handleDetailsClick = (event: React.SyntheticEvent<HTMLButtonElement>) => {
    const { currentTarget } = event
    const metricId = toIntOrNull(currentTarget.dataset.metricId)
    const metricsRowDatum = props.metricAssignmentsRowData.find(
      (metricsRowDatum) => metricsRowDatum.metric?.metricId === metricId,
    )
    if (metricsRowDatum) {
      setSelectedMetric(metricsRowDatum.metric || null)
    }
  }

  const handleDialogClose = () => {
    setSelectedMetric(null)
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Minimum Difference</th>
            <th>Attribution Window</th>
            <th>Changes Expected</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {props.metricAssignmentsRowData.map((metricsRowDatum) =>
            metricsRowDatum.metric ? (
              <tr key={metricsRowDatum.metricAssignmentId}>
                <td>{metricsRowDatum.metric.name}</td>
                <td>
                  <MetricMinimumDifference
                    metric={metricsRowDatum.metric}
                    minDifference={metricsRowDatum.minDifference}
                  />
                </td>
                <td>
                  <AttributionWindow attributionWindowSeconds={metricsRowDatum.attributionWindowSeconds} />
                </td>
                <td>
                  <BooleanText value={metricsRowDatum.changeExpected} />
                </td>
                <td>
                  <button type='button' data-metric-id={metricsRowDatum.metric.metricId} onClick={handleDetailsClick}>
                    Details
                  </button>
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={5}>
                  <p>TODO: Decide how to handle this unlikely situation</p>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
      {selectedMetric && (
        <Dialog onClose={handleDialogClose} open>
          <DialogTitle>Metric Details</DialogTitle>
          <DialogContent>
            <MetricDetails metric={selectedMetric} />
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleDialogClose} color='primary'>
              Dismiss
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}

function SegmentsTable(props: { segments: Segment[]; type: SegmentType }) {
  const sortedSegments = [...props.segments].sort()
  return (
    <table>
      <thead>
        <tr>
          <th>{props.type}</th>
        </tr>
      </thead>
      <tbody>
        {sortedSegments.map((segment) => (
          <tr key={segment.segmentId}>
            <td>{segment.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function VariationsTable(props: { variations: Variation[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Percent</th>
        </tr>
      </thead>
      <tbody>
        {props.variations.map((variation) => {
          return (
            <tr key={variation.variationId}>
              <td>
                {variation.name} {variation.isDefault && <span className='pill'>Default</span>}
              </td>
              <td>{variation.allocatedPercentage}%</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function ExperimentDetails(props: { experiment: ExperimentFull; metrics: MetricFull[]; segments: Segment[] }) {
  const { experiment, metrics: metricsLut, segments: segmentsLut } = props

  const metricAssignmentsRowData = toMetricAssignmentsRowData(experiment.metricAssignments, metricsLut)
  const segmentsByType = toSegmentsByType(experiment.segmentAssignments, segmentsLut)
  const hasSegments = experiment.segmentAssignments.length > 0

  /* eslint-disable jsx-a11y/label-has-associated-control */
  return (
    <div>
      <div className='clearfix'>
        <span className='font-bold'>{experiment.name}</span>
        <span className='pill'>{experiment.status}</span>
        <Button className='float-right' variant='contained'>
          Edit
        </Button>
      </div>
      <Paper>
        <h3>General</h3>
        <table>
          <tbody>
            <tr>
              <td>
                <label>Description</label>
              </td>
              <td>{experiment.description}</td>
            </tr>
            <tr>
              <td>
                <label>P2 Link</label>
              </td>
              <td>
                <a href={experiment.p2Url} rel='noopener noreferrer' target='_blank'>
                  {experiment.p2Url}
                </a>
              </td>
            </tr>
            <tr>
              <td>
                <label>Dates</label>
              </td>
              <td>
                <DatetimeText value={experiment.startDatetime} /> to <DatetimeText value={experiment.endDatetime} />
              </td>
            </tr>
            <tr>
              <td>
                <label>Owner</label>
              </td>
              <td>
                <span className='d-inline-block'>
                  <Avatar className='small'>
                    {experiment.ownerLogin
                      .split('_')
                      .slice(0, 2)
                      .map((parts) => parts[0])
                      .join('')
                      .toUpperCase()}
                  </Avatar>
                </span>{' '}
                {experiment.ownerLogin}
              </td>
            </tr>
          </tbody>
        </table>
      </Paper>
      <Paper>
        <h3>Audience</h3>
        <table>
          <tbody>
            <tr>
              <td>
                <label>Platform</label>
              </td>
              <td>{experiment.platform}</td>
            </tr>
            <tr>
              <td>
                <label>User Type</label>
              </td>
              <td>{experiment.existingUsersAllowed ? 'All User (new + existing)' : 'New users only'}</td>
            </tr>
            <tr>
              <td>
                <label>Variations</label>
              </td>
              <td>
                <VariationsTable variations={experiment.variations} />
              </td>
            </tr>
            {hasSegments ? (
              <tr>
                <td>
                  <label>Segments</label>
                </td>
                <td>
                  {segmentsByType[SegmentType.Country].length > 0 && (
                    <SegmentsTable segments={segmentsByType[SegmentType.Country]} type={SegmentType.Country} />
                  )}
                  {segmentsByType[SegmentType.Locale].length > 0 && (
                    <SegmentsTable segments={segmentsByType[SegmentType.Locale]} type={SegmentType.Locale} />
                  )}
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={2}>No segments assigned</td>
              </tr>
            )}
          </tbody>
        </table>
      </Paper>
      <Paper>
        <h3>Metrics</h3>
        <MetricAssignmentsTable metricAssignmentsRowData={metricAssignmentsRowData} />
      </Paper>
      <pre>{JSON.stringify(experiment, null, 2)}</pre>
    </div>
  )
  /* eslint-enable jsx-a11y/label-has-associated-control */
}

export default function ExperimentPage() {
  const experimentId = toIntOrNull(useRouter().query.id)
  debug(`ExperimentPage#render ${experimentId}`)

  const [fetchError, setFetchError] = useState<Error | null>(null)
  const [experiment, setExperiment] = useState<ExperimentFull | null>(null)
  const [metrics, setMetrics] = useState<MetricFull[] | null>(null)
  const [segments, setSegments] = useState<Segment[] | null>(null)

  useEffect(() => {
    if (experimentId === null) {
      setFetchError({ name: 'nullExperimentId', message: 'Experiment not found' })
      return
    }

    setFetchError(null)
    setExperiment(null)
    setMetrics(null)
    setSegments(null)

    Promise.all([ExperimentsApi.findById(experimentId), SegmentsApi.findAll()])
      .then(async ([experiment, segments]) => {
        setExperiment(experiment)
        setSegments(segments)

        const metricIds = experiment.metricAssignments.map((metricAssignment) => metricAssignment.metricId)
        setMetrics(await MetricsApi.findById(metricIds))
        return
      })
      .catch(setFetchError)
  }, [experimentId])

  return (
    <Layout title='Experiment: insert_name_here'>
      <Container>
        {fetchError && <ErrorsBox errors={[fetchError]} />}
        {experiment && metrics && segments && (
          <ExperimentDetails experiment={experiment} metrics={metrics} segments={segments} />
        )}
        <p>
          TODO: Fix the flash-of-error-before-data-load. That is, the `ErrorsBox` initially renders because
          `experimentId` is initially `null`.
        </p>
      </Container>
    </Layout>
  )
}
