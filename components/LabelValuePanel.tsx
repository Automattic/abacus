import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell, { TableCellProps } from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import React, { ReactNode } from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      padding: theme.spacing(1, 2),
    },
  }),
)

/**
 * A panel to display a label followed by its value. The label/value pairs are
 * rendered in a columnar fashion.
 */
function LabelValuePanel({
  data,
  title,
}: {
  data: { label: string; padding?: TableCellProps['padding']; value: ReactNode }[]
  title: string
}) {
  const classes = useStyles()
  return (
    <Paper>
      <Typography className={classes.title} color='textPrimary' variant='h3'>
        {title}
      </Typography>
      <Table>
        <TableBody>
          {data.map(({ label, padding, value }) => (
            <TableRow key={label}>
              <TableCell component='th' scope='row' variant='head'>
                {label}
              </TableCell>
              <TableCell padding={padding}>{value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

export default LabelValuePanel
