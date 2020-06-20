import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell, { TableCellProps } from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import React, { ReactNode } from 'react'

/**
 * A panel to display a label followed by it's value. The label/value pairs are
 * rendered in a columnar fashion.
 */
function LabelValuePanel(props: {
  data: { label: string; padding?: TableCellProps['padding']; value: ReactNode }[]
  title: string
}) {
  const { data, title } = props
  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={2}>
              <Typography color='textPrimary' variant='h3'>
                {title}
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
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
