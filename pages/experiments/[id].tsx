import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
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
import OwnerAvatar from '@/components/OwnerAvatar'
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

function toSegmentsByType(segmentAssignments: SegmentAssignment[], segments: Segment[]) {
  const segmentsByType: { [SegmentType.Country]: Segment[]; [SegmentType.Locale]: Segment[] } = {
    [SegmentType.Country]: [],
    [SegmentType.Locale]: [],
  }
  segmentAssignments.forEach((segmentAssignment) => {
    const segment = segments.find((segment) => segment.segmentId === segmentAssignment.segmentId)
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

function AudienceTable(props: { experiment: ExperimentFull; segments: Segment[] }) {
  const { experiment, segments } = props

  const segmentsByType = toSegmentsByType(experiment.segmentAssignments, segments)
  const hasSegments = experiment.segmentAssignments.length > 0
  return (
    <Table>
      <TableBody>
        <TableRow className='align-top'>
          <TableCell component='th' scope='row' variant='head'>
            Platform
          </TableCell>
          <TableCell>{experiment.platform}</TableCell>
        </TableRow>
        <TableRow className='align-top'>
          <TableCell component='th' scope='row' variant='head'>
            User Type
          </TableCell>
          <TableCell>{experiment.existingUsersAllowed ? 'All User (new + existing)' : 'New users only'}</TableCell>
        </TableRow>
        <TableRow className='align-top'>
          <TableCell component='th' scope='row' variant='head'>
            Variations
          </TableCell>
          <TableCell>
            <VariationsTable variations={experiment.variations} />
          </TableCell>
        </TableRow>
        {hasSegments ? (
          <TableRow className='align-top'>
            <TableCell component='th' scope='row' variant='head'>
              Segments
            </TableCell>
            <TableCell>
              {segmentsByType[SegmentType.Country].length > 0 && (
                <SegmentsTable segments={segmentsByType[SegmentType.Country]} type={SegmentType.Country} />
              )}
              {segmentsByType[SegmentType.Locale].length > 0 && (
                <SegmentsTable segments={segmentsByType[SegmentType.Locale]} type={SegmentType.Locale} />
              )}
            </TableCell>
          </TableRow>
        ) : (
          <TableRow>
            <TableCell colSpan={2}>No segments assigned</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

function ConclusionsTable(props: { experiment: ExperimentFull }) {
  const { experiment } = props
  const deployedVariation = experiment.variations.find(
    (variation) => experiment.deployedVariationId === variation.variationId,
  )
  return (
    <Table>
      <TableBody>
        <TableRow className='align-top'>
          <TableCell component='th' scope='row' variant='head'>
            Description for ending experiment
          </TableCell>
          <TableCell>{experiment.endReason}</TableCell>
        </TableRow>
        <TableRow className='align-top'>
          <TableCell component='th' scope='row' variant='head'>
            Conclusion URL
          </TableCell>
          <TableCell>{experiment.conclusionUrl}</TableCell>
        </TableRow>
        <TableRow className='align-top'>
          <TableCell component='th' scope='row' variant='head'>
            Deployed variation
          </TableCell>
          <TableCell>{deployedVariation?.name}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

function GeneralTable(props: { experiment: ExperimentFull }) {
  const { experiment } = props
  return (
    <Table>
      <TableBody>
        <TableRow className='align-top'>
          <TableCell component='th' variant='head'>
            Description
          </TableCell>
          <TableCell>{experiment.description}</TableCell>
        </TableRow>
        <TableRow className='align-top'>
          <TableCell component='th' variant='head'>
            P2 Link
          </TableCell>
          <TableCell>
            <a href={experiment.p2Url} rel='noopener noreferrer' target='_blank'>
              {experiment.p2Url}
            </a>
          </TableCell>
        </TableRow>
        <TableRow className='align-top'>
          <TableCell component='th' variant='head'>
            Dates
          </TableCell>
          <TableCell>
            <DatetimeText value={experiment.startDatetime} /> to <DatetimeText value={experiment.endDatetime} />
          </TableCell>
        </TableRow>
        <TableRow className='align-top'>
          <TableCell component='th' variant='head'>
            Owner
          </TableCell>
          <TableCell>
            <OwnerAvatar ownerLogin={experiment.ownerLogin} /> {experiment.ownerLogin}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
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
      <Table>
        <TableHead>
          <TableRow>
            <TableCell component='th' variant='head'>
              Name
            </TableCell>
            <TableCell component='th' variant='head'>
              Minimum Difference
            </TableCell>
            <TableCell component='th' variant='head'>
              Attribution Window
            </TableCell>
            <TableCell component='th' variant='head'>
              Changes Expected
            </TableCell>
            <TableCell component='th' variant='head'></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.metricAssignmentsRowData.map((metricsRowDatum) =>
            metricsRowDatum.metric ? (
              <TableRow key={metricsRowDatum.metricAssignmentId}>
                <TableCell>{metricsRowDatum.metric.name}</TableCell>
                <TableCell>
                  <MetricMinimumDifference
                    metric={metricsRowDatum.metric}
                    minDifference={metricsRowDatum.minDifference}
                  />
                </TableCell>
                <TableCell>
                  <AttributionWindow attributionWindowSeconds={metricsRowDatum.attributionWindowSeconds} />
                </TableCell>
                <TableCell>
                  <BooleanText value={metricsRowDatum.changeExpected} />
                </TableCell>
                <TableCell>
                  <button type='button' data-metric-id={metricsRowDatum.metric.metricId} onClick={handleDetailsClick}>
                    Details
                  </button>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={5}>
                  <p>TODO: Decide how to handle this unlikely situation</p>
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>
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
    <Table>
      <TableHead>
        <TableRow>
          <TableCell component='th' variant='head'>
            {props.type}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedSegments.map((segment) => (
          <TableRow key={segment.segmentId}>
            <TableCell>{segment.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function VariationsTable(props: { variations: Variation[] }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell component='th' variant='head'>
            Name
          </TableCell>
          <TableCell component='th' variant='head'>
            Percent
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.variations.map((variation) => {
          return (
            <TableRow key={variation.variationId}>
              <TableCell>
                {variation.name} {variation.isDefault && <span className='pill'>Default</span>}
              </TableCell>
              <TableCell>{variation.allocatedPercentage}%</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

function ExperimentDetails(props: { experiment: ExperimentFull; metrics: MetricFull[]; segments: Segment[] }) {
  const { experiment, metrics, segments } = props

  const metricAssignmentsRowData = toMetricAssignmentsRowData(experiment.metricAssignments, metrics)

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
        <GeneralTable experiment={experiment} />
      </Paper>
      <Paper>
        <h3>Audience</h3>
        <AudienceTable experiment={experiment} segments={segments} />
      </Paper>
      <Paper>
        <h3>Metrics</h3>
        <MetricAssignmentsTable metricAssignmentsRowData={metricAssignmentsRowData} />
      </Paper>
      <Paper>
        <h3>Conclusions</h3>
        <ConclusionsTable experiment={experiment} />
      </Paper>
      <pre>{JSON.stringify(experiment, null, 2)}</pre>
    </div>
  )
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
      </Container>
    </Layout>
  )
}
