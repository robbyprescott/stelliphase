class Circle {
  constructor({ radius = 1, fill = '#FFB3BA' } = {}) {
    this.radius = radius
    this.fill = fill
  }

  render(baseSize = 1) {
    const scaledRadius = this.radius * baseSize

    return (
      <circle
        cx="0"
        cy="0"
        r={scaledRadius}
        fill={this.fill}
        stroke="none"
      />
    )
  }
}

export default Circle
