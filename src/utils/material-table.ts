import { Options } from 'material-table'

import theme from 'src/styles/theme'

/**
 * Default table options for dynamic MaterialTable instances.
 */
export const defaultTableOptions: Options = {
  emptyRowsWhenPaging: false,
  pageSize: 25,
  showEmptyDataSourceMessage: false,
  showTitle: false,
  search: true,
  toolbar: true,
  searchFieldVariant: 'standard',
  searchFieldAlignment: 'left',
  pageSizeOptions: [],
  showFirstLastPageButtons: false,
  headerStyle: {
    fontWeight: theme.custom.fontWeights.monospaceBold,
  },
  rowStyle: {
    opacity: 0.8,
  },
}

/**
 * Create an Options object that can be passed to MaterialTable to create a static table with no toolbar or pagination.
 *
 * @param numRows the exact number of rows that the table should have.
 */
export function createStaticTableOptions(numRows: number): Options {
  return {
    ...defaultTableOptions,
    pageSize: numRows,
    draggable: false,
    paging: false,
    sorting: false,
    toolbar: false,
  }
}
