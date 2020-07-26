import { IconButton, Menu } from '@material-ui/core'
import { MoreVert as MoreVertIcon } from '@material-ui/icons'
import React from 'react'

export default function MoreMenu({ children }: { children: React.ReactNode }) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <IconButton aria-label='more' aria-controls='menu' aria-haspopup='true' onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu id='menu' anchorEl={anchorEl} keepMounted open={open} onClose={handleClose} onClick={handleClose}>
        {children}
      </Menu>
    </div>
  )
}
