import Avatar from '@material-ui/core/Avatar'
import React from 'react'

/**
 * Renders the boolean value in human readable text.
 */
const OwnerAvatar = (props: { ownerLogin: string }) => (
  <span className='d-inline-block'>
    <Avatar className='small'>
      {props.ownerLogin
        .split('_')
        .slice(0, 2)
        .map((parts) => parts[0])
        .join('')
        .toUpperCase()}
    </Avatar>
  </span>
)

export default OwnerAvatar
