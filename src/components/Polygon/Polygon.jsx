class Polygon {
  constructor({ radius = 1, rotation = 0, fill = '#BAE1FF', stroke = 'none', fillRule = 'nonzero' } = {}) {
    this.radius = radius
    this.rotation = rotation
    this.fill = fill
    this.stroke = stroke
    this.fillRule = fillRule
  }

  // To be implemented by child classes
  calculatePoints(baseSize = 1) {
    throw new Error('calculatePoints() must be implemented by child class')
  }

  render(baseSize = 1) {
    // Convert rotation from radians to degrees for SVG
    const rotationDegrees = this.rotation * (180 / Math.PI)

    return (
      <g transform={`rotate(${rotationDegrees} 0 0)`}>
        <polygon
          points={this.calculatePoints(baseSize)}
          fill={this.fill}
          fillRule={this.fillRule}
          stroke="none"
        />
      </g>
    )
  }
}

export default Polygon
