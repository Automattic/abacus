import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import clsx from 'clsx'
import debugFactory from 'debug'
import { useRouter } from 'next/router'
import { toIntOrNull } from 'qc-to_int'
import React, { useEffect, useState } from 'react'

import ExperimentsApi from '@/api/ExperimentsApi'
import MetricsApi from '@/api/MetricsApi'
import SegmentsApi from '@/api/SegmentsApi'
import DatetimeText from '@/components/DatetimeText'
import ExperimentTabs from '@/components/ExperimentTabs'
import Layout from '@/components/Layout'
import {
  AttributionWindowSeconds,
  AttributionWindowSecondsToHuman,
  ExperimentFull,
  MetricAssignment,
  MetricBare,
  Segment,
  SegmentAssignment,
  SegmentType,
  Variation,
} from '@/models'
import { formatBoolean, formatUsCurrencyDollar } from '@/utils/formatters'

const debug = debugFactory('abacus:pages/experiments/[id].tsx')

interface MetricAssignmentsRowData {
  attributionWindowSeconds: AttributionWindowSeconds
  changeExpected: boolean
  isPrimary: boolean
  metric?: MetricBare
  metricAssignmentId: number
  minDifference: number
}

function toMetricAssignmentsRowData(metricAssignments: MetricAssignment[], metrics: MetricBare[]) {
  debug('toMetricAssignmentsRowData', metricAssignments, metrics)
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

function AudiencePanel(props: { experiment: ExperimentFull; segments: Segment[] }) {
  const { experiment, segments } = props

  const segmentsByType = toSegmentsByType(experiment.segmentAssignments, segments)
  const hasSegments = experiment.segmentAssignments.length > 0
  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={2}>
              <Typography color='textPrimary' variant='h3'>
                Audience
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
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
            <TableCell padding='none'>
              <VariationsTable variations={experiment.variations} />
            </TableCell>
          </TableRow>
          {hasSegments ? (
            <TableRow className='align-top'>
              <TableCell component='th' scope='row' variant='head'>
                Segments
              </TableCell>
              <TableCell padding='none'>
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
    </Paper>
  )
}

function ConclusionsPanel(props: { experiment: ExperimentFull }) {
  const { experiment } = props
  const deployedVariation = experiment.variations.find(
    (variation) => experiment.deployedVariationId === variation.variationId,
  )
  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={2}>
              <Typography color='textPrimary' variant='h3'>
                Conclusions
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
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
    </Paper>
  )
}

function GeneralPanel(props: { experiment: ExperimentFull }) {
  const { experiment } = props
  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={2}>
              <Typography color='textPrimary' variant='h3'>
                General
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
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
              <DatetimeText datetime={experiment.startDatetime} excludeTime /> to{' '}
              <DatetimeText datetime={experiment.endDatetime} excludeTime />
            </TableCell>
          </TableRow>
          <TableRow className='align-top'>
            <TableCell component='th' variant='head'>
              Owner
            </TableCell>
            <TableCell>{experiment.ownerLogin}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  )
}

function MetricAssignmentsPanel(props: { metricAssignmentsRowData: MetricAssignmentsRowData[] }) {
  const [selectedMetric, setSelectedMetric] = useState<MetricBare | null>(null)

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
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={5}>
              <Typography color='textPrimary' variant='h3'>
                Metrics
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
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
                  <span>
                    {metricsRowDatum.metric.parameterType === 'revenue'
                      ? formatUsCurrencyDollar(metricsRowDatum.minDifference)
                      : `${metricsRowDatum.minDifference} pp`}
                  </span>
                </TableCell>
                <TableCell>{AttributionWindowSecondsToHuman[metricsRowDatum.attributionWindowSeconds]}</TableCell>
                <TableCell>{formatBoolean(metricsRowDatum.changeExpected)}</TableCell>
                <TableCell>
                  <Button
                    data-metric-id={metricsRowDatum.metric.metricId}
                    onClick={handleDetailsClick}
                    variant='contained'
                  >
                    Details
                  </Button>
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
            <p>TODO: Remove dialog and link to /metrics/[id].</p>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleDialogClose} color='primary'>
              Dismiss
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Paper>
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

function ExperimentDetails(props: { experiment: ExperimentFull; metrics: MetricBare[]; segments: Segment[] }) {
  const { experiment, metrics, segments } = props

  const metricAssignmentsRowData = toMetricAssignmentsRowData(experiment.metricAssignments, metrics)

  return (
    <div className='experiment experiment--details'>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className='clearfix'>
            <span className='name mr-2'>{experiment.name}</span>
            <span className={clsx('experiment-status', status)}>{status}</span>
            <Button className='float-right' variant='contained'>
              Edit
            </Button>
          </div>
        </Grid>
        <Grid item xs={12} md={8}>
          <Grid container direction='column' spacing={2}>
            <Grid item>
              <GeneralPanel experiment={experiment} />
            </Grid>
            <Grid item>
              <MetricAssignmentsPanel metricAssignmentsRowData={metricAssignmentsRowData} />
            </Grid>
            <Grid item>
              <ConclusionsPanel experiment={experiment} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid container direction='column' spacing={2}>
            <Grid item>
              <AudiencePanel experiment={experiment} segments={segments} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <pre>{JSON.stringify(experiment, null, 2)}</pre>
    </div>
  )
}

export default function ExperimentPage() {
  const experimentId = toIntOrNull(useRouter().query.id)
  debug(`ExperimentPage#render ${experimentId}`)

  const [fetchError, setFetchError] = useState<Error | null>(null)
  const [experiment, setExperiment] = useState<ExperimentFull | null>(null)
  const [metrics, setMetrics] = useState<MetricBare[] | null>(null)
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
        setMetrics(await MetricsApi.findAll())
        return
      })
      .catch(setFetchError)
  }, [experimentId])

  return (
    <Layout title={`Experiment: ${experiment ? experiment.name : 'Not Found'}`} error={fetchError}>
      <ExperimentTabs experiment={experiment} />
      {experiment && metrics && segments && (
        <ExperimentDetails experiment={experiment} metrics={metrics} segments={segments} />
      )}
    </Layout>
  )
}
