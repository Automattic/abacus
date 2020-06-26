import { Options } from 'material-table'

export const defaultTableOptions: Options = {
  emptyRowsWhenPaging: false,
  pageSize: 25,
  showEmptyDataSourceMessage: false,
  showTitle: false,
  search: false,
  toolbar: false,
  pageSizeOptions: [],
  showFirstLastPageButtons: false,
  headerStyle: {
    fontWeight: 600,
  },
  rowStyle: {
    opacity: 0.8,
  },
}
