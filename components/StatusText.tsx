import clsx from 'clsx'
import React from 'react'

import { Status } from '@/models'

/**
 * Renders the experiment status.
 */
const StatusText = ({ status }: { status: Status }) => (
  <span className={clsx('experiment-status', status)}>{status}</span>
)

export default StatusText
