import type { RenderError } from '@/components/RenderErrorBoundary'

function onRenderError(renderError: RenderError) {
  const { error, info } = renderError
  console.error('Render Error:\n\n', error, info)
}

export { onRenderError }
