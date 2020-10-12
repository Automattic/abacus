import theme from 'src/styles/theme'

// ## Colors - Categorical
//
// These come from our internal data colors and should be visually equidistant.

// We hand out colors based on the order of the variant.
// Control and Treatment should have a consistent order even across experiments so this should give good results.
// Ideally we would add some marker to differentiate control variants
export const variantColors = ['#1f78b488', '#ff7f0088']

export const totalParticipantsColor = '#a6cee388'
export const exposedParticipantsColor = '#33a02c88'

// Unused internal colors: #fb9a9988, #e31a1c88, #fdbf6f88, #cab2d688, #b2df8a88

// ## Plotly Setup

export const plotlyLayoutDefault = {
  autosize: true,
  showlegend: false,
  hoverlabel: {
    // Don't restrict name lengths
    namelength: -1,
  },
  margin: {
    l: theme.spacing(4),
    r: theme.spacing(2),
    t: theme.spacing(8),
    b: theme.spacing(6),
  },
}
