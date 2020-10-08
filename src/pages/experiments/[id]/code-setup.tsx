import dynamic from 'next/dynamic'
import React from 'react'

const NoSsrRoutes = dynamic(() => import('src/Routes'), { ssr: false })

export default function ExperimentCodeSetup(): JSX.Element | null {
  return <NoSsrRoutes />
}
