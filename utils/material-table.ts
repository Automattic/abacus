import { Options } from 'material-table'

import theme from '@/styles/theme'

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
