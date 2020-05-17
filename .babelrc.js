// Note: This file with the Next.js preset was added to get Jest to use the same
// configuration that Next.js would use when this explicit Babel configuration was
// not present.
module.exports = {
  presets: ['next/babel'],
  plugins: [process.env.NODE_ENV === 'production' && 'babel-plugin-remove-debug'].filter(Boolean),
}
