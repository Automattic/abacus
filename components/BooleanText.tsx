import React from 'react'

/**
 * Renders the boolean value in human readable text.
 */
const BooleanText = (props: { value: boolean }) => (
  // Note: This mainly centralizes the text displayed instead of repeating the line
  // below everywhere.
  <span>{props.value ? 'Yes' : 'No'}</span>
)

export default BooleanText
