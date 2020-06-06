import React from 'react'

interface Props {
  value: boolean
}

/**
 * Renders the boolean value in human readable text.
 */
const BooleanText = (props: Props) => (
  // Note: This mainly centralizes the text displayed instead of repeating the line
  // below everywhere.
  <span>{props.value ? 'Yes' : 'No'}</span>
)

export default BooleanText
