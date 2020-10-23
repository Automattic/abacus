import { useTheme } from '@material-ui/core'
import debugFactory from 'debug'
import MaterialTable from 'material-table'
import React from 'react'

import { TagBare } from 'src/lib/schemas'
import { defaultTableOptions } from 'src/utils/material-table'

const debug = debugFactory('abacus:components/TagsTable.tsx')

/**
 * Renders a table of tags.
 *
 * @param tags An array of tags.
 * @param onEditTag A Callback. Setting this will show the edit action in the table.
 */
const TagsTable = ({ tags, onEditTag }: { tags: TagBare[]; onEditTag?: (tagId: number) => void }): JSX.Element => {
  debug('TagsTable#render')

  const theme = useTheme()
  const tableColumns = [
    {
      title: 'Tag',
      cellStyle: {
        fontFamily: theme.custom.fonts.monospace,
        fontWeight: theme.custom.fontWeights.monospaceBold,
      },
      render: (tag: TagBare) => `${tag.namespace}/${tag.name}`,
    },
    {
      title: 'Description',
      field: 'description',
      cellStyle: {
        fontFamily: theme.custom.fonts.monospace,
      },
    },
  ]

  return (
    <MaterialTable
      actions={
        onEditTag
          ? [
              {
                icon: 'edit',
                tooltip: 'Edit Tag',
                onClick: (_event, rowData) => {
                  onEditTag((rowData as TagBare).tagId)
                },
              },
            ]
          : undefined
      }
      columns={tableColumns}
      data={tags}
      options={{
        ...defaultTableOptions,
        actionsColumnIndex: 3,
      }}
    />
  )
}

export default TagsTable
