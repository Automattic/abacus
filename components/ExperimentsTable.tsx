import { format } from 'date-fns'
import debugFactory from 'debug'
import { toInt } from 'qc-to_int'
import React, { MouseEvent, useState } from 'react'

import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu'
import Table from 'semantic-ui-react/dist/commonjs/collections/Table'

import { ExperimentBare } from '@/models/index'

const debug = debugFactory('abacus:components/ExperimentsTable.tsx')

const PER_PAGE_DEFAULT = 25

interface Props {
  experiments: ExperimentBare[]
  // The zero-based page of data to display. Defaults to 0.
  initialPage?: number
  // The number of rows/items to display per page. Defaults to PER_PAGE_DEFAULT.
  perPage?: number
}

/**
 * Renders a table of "bare" experiment information.
 */
const ExperimentsTable = (props: Props) => {
  debug('ExperimentsTable#render')
  const { experiments, initialPage = 0, perPage = PER_PAGE_DEFAULT } = props
  const [page, setPage] = useState(initialPage)

  const pageCount = Math.ceil(experiments.length / perPage)
  const pageNums = Array.from(Array(pageCount).keys()).map((num) => num + 1)

  function handlePageStep(event: MouseEvent<HTMLAnchorElement>) {
    debug('ExperimentsTable#handlePageStep')
    event.preventDefault()
    event.stopPropagation()
    setPage(page + toInt(event.currentTarget.dataset.step))
  }

  function handleSetPage(event: MouseEvent<HTMLAnchorElement>) {
    debug('ExperimentsTable#handleSetPage')
    event.preventDefault()
    event.stopPropagation()
    setPage(toInt(event.currentTarget.dataset.page))
  }

  const beginIdx = perPage * page
  const endIdx = beginIdx + perPage
  const experimentsToRender = experiments.slice(beginIdx, endIdx)
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>ID</Table.HeaderCell>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Start</Table.HeaderCell>
          <Table.HeaderCell>End</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
          <Table.HeaderCell>Platform</Table.HeaderCell>
          <Table.HeaderCell>Owner</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {experimentsToRender.map((experiment) => (
          <React.Fragment key={experiment.experimentId}>
            <Table.Row>
              <Table.Cell>{experiment.experimentId}</Table.Cell>
              <Table.Cell>{experiment.name}</Table.Cell>
              <Table.Cell>{format(experiment.startDatetime, 'yyyy-MM-dd')}</Table.Cell>
              <Table.Cell>{format(experiment.endDatetime, 'yyyy-MM-dd')}</Table.Cell>
              <Table.Cell>{experiment.status}</Table.Cell>
              <Table.Cell>{experiment.platform}</Table.Cell>
              <Table.Cell>{experiment.ownerLogin}</Table.Cell>
            </Table.Row>
          </React.Fragment>
        ))}
      </Table.Body>
      {pageCount > 1 && (
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan='7'>
              <Menu floated='right' pagination>
                <Menu.Item
                  data-step={-1}
                  disabled={page <= 0}
                  icon='chevron left'
                  onClick={handlePageStep}
                  role='button'
                />
                {pageNums.map((num) => (
                  <Menu.Item
                    key={num}
                    active={page === num - 1}
                    content={num}
                    data-page={num - 1}
                    onClick={handleSetPage}
                    role='button'
                  />
                ))}
                <Menu.Item
                  data-step={1}
                  disabled={page + 1 >= pageCount}
                  icon='chevron right'
                  onClick={handlePageStep}
                  role='button'
                />
              </Menu>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      )}
    </Table>
  )
}

export { PER_PAGE_DEFAULT }
export default ExperimentsTable
