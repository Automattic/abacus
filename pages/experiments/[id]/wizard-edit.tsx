import React from 'react'
import dynamic from 'next/dynamic';

const NoSsrRoutes = dynamic(() => import('@/Routes'), { ssr: false })

export default function ExperimentWizardEdit(): JSX.Element | null {
  return <NoSsrRoutes />
}