import { Options } from 'material-table'

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
    fontWeight: 600,
  },
  rowStyle: {
    opacity: 0.8,
  },
}
