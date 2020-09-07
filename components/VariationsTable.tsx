import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import React from 'react'

import Label from '@/components/Label'
import { Variation } from '@/lib/schemas'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    default: {
      marginLeft: theme.spacing(1),
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

/**
 * Renders the variations in tabular formation, in the order that they're given.
 *
 * @param props.variations - The variations to render.
 */
function VariationsTable({
  variations,
  experimentName,
  experimentPlatform,
}: {
  variations: Variation[]
  experimentName: string
  experimentPlatform: string
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
        {variations.map((variation) => {
          return (
            <TableRow key={variation.variationId}>
              <TableCell>
                <a href={assignmentHref(variation.name, experimentName, experimentPlatform)}>{variation.name}</a>
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
