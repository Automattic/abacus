import * as notistack from 'notistack'

/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
// @ts-ignore
window.URL.createObjectURL = jest.fn()

window.HTMLCanvasElement.prototype.getContext = jest.fn()

jest.mock('notistack')
const mockedNotistack = notistack as jest.Mocked<typeof notistack>
beforeEach(() => {
  mockedNotistack.useSnackbar.mockImplementation(() => ({
    enqueueSnackbar: jest.fn(),
    closeSnackbar: jest.fn(),
  }))
})
