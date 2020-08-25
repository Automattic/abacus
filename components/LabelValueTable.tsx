import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import React, { ReactNode } from 'react'

/**
 * A table of label/value pairs.
 */
function LabelValueTable({ className, data }: { className?: string; data: { label: string; value: ReactNode }[] }) {
  return (
    <Table className={className}>
      <TableBody>
        {data.map(({ label, value }) => (
          <TableRow key={label}>
            <TableCell component='th' scope='row' variant='head'>
              {label}
            </TableCell>
            <TableCell>{value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default LabelValueTable
