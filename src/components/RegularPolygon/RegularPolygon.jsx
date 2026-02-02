class RegularPolygon {
  constructor({ nSides = 3, radius = 1, rotation = 0, fill = '#BAE1FF', stroke = 'none' } = {}) {
    this.nSides = nSides
    this.radius = radius
    this.rotation = rotation
    this.fill = fill
    this.stroke = stroke
  }

  calculatePoints(baseSize = 1) {
    const points = []
    const angleStep = (2 * Math.PI) / this.nSides
    const startAngle = -Math.PI / 2 // Start from top (-90 degrees)
    const scaledRadius = this.radius * baseSize

    for (let i = 0; i < this.nSides; i++) {
      const angle = startAngle + angleStep * i
      const x = scaledRadius * Math.cos(angle)
      const y = scaledRadius * Math.sin(angle)
      points.push(`${x},${y}`)
    }

    return points.join(' ')
  }

  render(baseSize = 1) {
    // Convert rotation from radians to degrees for SVG
    const rotationDegrees = this.rotation * (180 / Math.PI)

    return (
      <g transform={`rotate(${rotationDegrees} 0 0)`}>
        <polygon
          points={this.calculatePoints(baseSize)}
          fill={this.fill}
          stroke="none"
        />
      </g>
    )
  }
}

export default RegularPolygon
