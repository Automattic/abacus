import { Tooltip, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { withStyles } from '@material-ui/styles'
import React from 'react'

import Label from '@/components/Label'
import { ExperimentFull } from '@/lib/schemas'
import * as Variations from '@/lib/variations'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    default: {
      marginLeft: theme.spacing(1),
    },
    variation: {
      borderBottom: '1px dashed #a3a3a3',
    },
  }),
)

function assignmentHref(variationName: string, experimentName: string, experimentPlatform: string) {
  return `javascript:(() => 
        fetch('https://public-api.wordpress.com/wpcom/v2/experiments/0.1.0/assignments/${experimentPlatform}?${experimentName}=${variationName}', {credentials: 'include'})
        .then(() => alert('Successfully set ${experimentName} to variation ${variationName}'))
        .catch((er) => alert('Unable to set variation: ' + er))
    )()`
}

function dangerousAssignmentLink(variationName: string, experimentName: string, experimentPlatform: string) {
  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __html: `<a href="${assignmentHref(
      variationName,
      experimentName,
      experimentPlatform,
    )}">${variationName} - ${experimentName}</a>`,
  }
}

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    maxWidth: '500px',
    border: '1px solid #dadde9',
    padding: theme.spacing(2),
    '& a:link': {
      color: '#cee6f8',
    },
  },
}))(Tooltip)

/**
 * Renders the variations in tabular formation, in the order that they're given.
 *
 * @param props.variations - The variations to render.
 */
function VariationsTable({
  experiment: { variations, name: experimentName, platform: experimentPlatform },
}: {
  experiment: ExperimentFull
}) {
  const classes = useStyles()
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
        {Variations.sort(variations).map((variation) => {
          return (
            <TableRow key={variation.variationId}>
              <TableCell>
                <HtmlTooltip
                  interactive
                  arrow
                  placement={'left'}
                  title={
                    <>
                      <Typography color='inherit' variant='body1' gutterBottom>
                        Drag this link to your bookmarks to make it easier to switch between active variations:
                      </Typography>
                      <Typography
                        color='inherit'
                        variant='body1'
                        dangerouslySetInnerHTML={dangerousAssignmentLink(
                          variation.name,
                          experimentName,
                          experimentPlatform,
                        )}
                      />
                    </>
                  }
                >
                  <span className={classes.variation}>{variation.name}</span>
                </HtmlTooltip>
                {variation.isDefault && <Label className={classes.default} text='Default' />}
              </TableCell>
              <TableCell>{variation.allocatedPercentage}%</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default VariationsTable
