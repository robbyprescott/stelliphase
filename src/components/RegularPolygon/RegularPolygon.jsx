function RegularPolygon({ nSides = 3, radius = 1, rotation = 0, fill = '#BAE1FF' }) {
  // Calculate vertices for a regular polygon
  const calculatePoints = () => {
    const points = []
    const angleStep = (2 * Math.PI) / nSides
    const startAngle = -Math.PI / 2 // Start from top (-90 degrees)

    for (let i = 0; i < nSides; i++) {
      const angle = startAngle + angleStep * i
      const x = radius * Math.cos(angle)
      const y = radius * Math.sin(angle)
      points.push(`${x},${y}`)
    }

    return points.join(' ')
  }

  return (
    <g transform={`rotate(${rotation} 0 0)`}>
      <polygon
        points={calculatePoints()}
        fill={fill}
        stroke="none"
      />
    </g>
  )
}

export default RegularPolygon
