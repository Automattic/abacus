import React from 'react'

const obj = {}

export default function BadComponent() {
  // Need a component that will fail when React attempts to render but also need
  // something that TypeScript will compile. The type assertion allows TS to
  // compile successfully but because we essentially lied to TS, it will fail as
  // runtime.
  return <>{(obj as { nonExistent: { boom: 'shaka laka' } }).nonExistent.boom}</>
}
