import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { useTheme } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell, { TableCellProps } from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import debugFactory from 'debug'
import _ from 'lodash'
import { useRouter } from 'next/router'
import { toIntOrNull } from 'qc-to_int'
import React, { useEffect, useState } from 'react'

import ExperimentsApi from '@/api/ExperimentsApi'
import MetricsApi from '@/api/MetricsApi'
import SegmentsApi from '@/api/SegmentsApi'
import DatetimeText from '@/components/DatetimeText'
import ExperimentStatus from '@/components/ExperimentStatus'
import ExperimentTabs from '@/components/ExperimentTabs'
import LabelValuePanel from '@/components/LabelValuePanel'
import Layout from '@/components/Layout'
import { AttributionWindowSecondsToHuman, ExperimentFull, MetricBare, Segment, SegmentType, Variation } from '@/models'
import { formatUsCurrencyDollar } from '@/utils/formatters'

const debug = debugFactory('abacus:pages/experiments/[id].tsx')

function AudiencePanel(props: { experiment: ExperimentFull; segments: Segment[] }) {
  const { experiment, segments } = props

  const resolvedSegmentAssignments = experiment.resolveSegmentAssignments(segments)
  const segmentsByType = _.groupBy(resolvedSegmentAssignments, _.property('segment.type'))
  const hasSegments = experiment.segmentAssignments.length > 0
  const data = [
    { label: 'Platform', value: experiment.platform },
    { label: 'User Type', value: experiment.existingUsersAllowed ? 'All User (new + existing)' : 'New users only' },
    {
      label: 'Variations',
      padding: 'none' as TableCellProps['padding'],
      value: <VariationsTable variations={experiment.variations} />,
    },
    {
      label: 'Segments',
      padding: (hasSegments ? 'none' : undefined) as TableCellProps['padding'],
      value: hasSegments ? (
        <>
          {segmentsByType[SegmentType.Country]?.length > 0 && (
            <SegmentsTable
              resolvedSegmentAssignments={segmentsByType[SegmentType.Country]}
              type={SegmentType.Country}
            />
          )}
          {segmentsByType[SegmentType.Locale]?.length > 0 && (
            <SegmentsTable resolvedSegmentAssignments={segmentsByType[SegmentType.Locale]} type={SegmentType.Locale} />
          )}
        </>
      ) : (
        'No segments assigned'
      ),
    },
  ]
  return <LabelValuePanel data={data} title='Audience' />
}

function ConclusionsPanel(props: { experiment: ExperimentFull }) {
  const { experiment } = props
  const deployedVariation = experiment.variations.find(
    (variation) => experiment.deployedVariationId === variation.variationId,
  )
  const data = [
    { label: 'Description for ending experiment', value: experiment.endReason },
    { label: 'Conclusion URL', value: experiment.conclusionUrl },
    { label: 'Deployed variation', value: deployedVariation?.name },
  ]
  return <LabelValuePanel data={data} title='Conclusions' />
}

function GeneralPanel(props: { experiment: ExperimentFull }) {
  const { experiment } = props
  const data = [
    { label: 'Description', value: experiment.description },
    {
      label: 'P2 Link',
      value: (
        <a href={experiment.p2Url} rel='noopener noreferrer' target='_blank'>
          {experiment.p2Url}
        </a>
      ),
    },
    {
      label: 'Dates',
      value: (
        <>
          <DatetimeText datetime={experiment.startDatetime} excludeTime /> to{' '}
          <DatetimeText datetime={experiment.endDatetime} excludeTime />
        </>
      ),
    },
    { label: 'Owner', value: experiment.ownerLogin },
  ]
  return <LabelValuePanel data={data} title='General' />
}

function MetricAssignmentsPanel({ experiment, metrics }: { experiment: ExperimentFull; metrics: MetricBare[] }) {
  const metricAssignmentsRowData = experiment.metricAssignments.map((metricAssignment) => ({
    attributionWindowSeconds: metricAssignment.attributionWindowSeconds,
    changeExpected: metricAssignment.changeExpected,
    isPrimary: metricAssignment.isPrimary,
    metric: metrics.find((metric) => metric.metricId === metricAssignment.metricId),
    metricAssignmentId: metricAssignment.metricAssignmentId as number,
    minDifference: metricAssignment.minDifference,
  }))

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={4}>
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
          </TableRow>
        </TableHead>
        <TableBody>
          {metricAssignmentsRowData.map((metricsRowDatum) =>
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
                <TableCell>
                  {/* TODO: Update to use formatBoolean */ metricsRowDatum.changeExpected ? 'Yes' : 'No'}
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={4}>
                  <p>TODO: Decide how to handle this unlikely situation</p>
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>
    </Paper>
  )
}

function SegmentsTable(props: {
  resolvedSegmentAssignments: {
    segment: Segment | null
    isExcluded: boolean
  }[]
  type: SegmentType
}) {
  const sortedResolvedSegmentAssignments = [...props.resolvedSegmentAssignments].sort((a, b) => {
    const segmentNameA = a.segment?.name ?? ''
    const segmentNameB = b.segment?.name ?? ''
    return segmentNameA < segmentNameB ? 1 : segmentNameA === segmentNameB ? -1 : 0
  })
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
        {sortedResolvedSegmentAssignments.map(
          (resolvedSegmentAssignment) =>
            resolvedSegmentAssignment.segment && (
              <TableRow key={resolvedSegmentAssignment.segment.segmentId}>
                <TableCell>
                  {resolvedSegmentAssignment.segment.name}{' '}
                  {resolvedSegmentAssignment.isExcluded && <span>Excluded</span>}
                </TableCell>
              </TableRow>
            ),
        )}
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

// TODO: Merge with standalone ExperimentDetails component.
function ExperimentDetails({
  debugMode,
  experiment,
  metrics,
  segments,
}: {
  experiment: ExperimentFull
  metrics: MetricBare[]
  segments: Segment[]
  debugMode?: boolean
}) {
  const theme = useTheme()
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <div className='experiment experiment--details'>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div>
            <span>{experiment.name}</span>
            <ExperimentStatus status={experiment.status} />
            <Button variant='contained'>Edit</Button>
          </div>
        </Grid>
        <Grid item xs={12} md={8}>
          <Grid container direction='column' spacing={2}>
            <Grid item>
              <GeneralPanel experiment={experiment} />
            </Grid>
            {isSmDown && (
              <Grid item>
                <AudiencePanel experiment={experiment} segments={segments} />
              </Grid>
            )}
            <Grid item>
              <MetricAssignmentsPanel experiment={experiment} metrics={metrics} />
            </Grid>
            <Grid item>
              <ConclusionsPanel experiment={experiment} />
            </Grid>
          </Grid>
        </Grid>
        {!isSmDown && (
          <Grid item md={4}>
            <AudiencePanel experiment={experiment} segments={segments} />
          </Grid>
        )}
      </Grid>
      {debugMode && <pre className='debug-json'>{JSON.stringify(experiment, null, 2)}</pre>}
    </div>
  )
}

export default function ExperimentPage() {
  const router = useRouter()
  const experimentId = toIntOrNull(router.query.id)
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
        <ExperimentDetails
          debugMode={router.query.debug === 'true'}
          experiment={experiment}
          metrics={metrics}
          segments={segments}
        />
      )}
    </Layout>
  )
}
