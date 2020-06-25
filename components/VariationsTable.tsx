import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import React from 'react'

import { Variation } from '@/models'

/**
 * Renders the variations in tabular formation.
 *
 * @param props.variations - The variations to render.
 */
function VariationsTable({ variations }: { variations: Variation[] }) {
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
                {variation.name}
                {variation.isDefault && <span className='pill'>Default</span>}
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
