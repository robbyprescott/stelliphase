import Polygon from '../Polygon/Polygon'

class StarPolygon extends Polygon {
  constructor({ nSides = 5, vertexJump = 2, radius = 1, rotation = 0, fill = '#BAE1FF', stroke = 'none', fillRule = 'evenodd' } = {}) {
    super({ radius, rotation, fill, stroke, fillRule })
    this.nSides = nSides
    this.vertexJump = vertexJump
  }

  calculatePoints(baseSize = 1) {
    const points = []
    const angleStep = (2 * Math.PI) / this.nSides
    const startAngle = -Math.PI / 2 // Start from top (-90 degrees)
    const scaledRadius = this.radius * baseSize

    // Create star by jumping vertices
    for (let i = 0; i < this.nSides; i++) {
      const vertexIndex = (i * this.vertexJump) % this.nSides
      const angle = startAngle + angleStep * vertexIndex
      const x = scaledRadius * Math.cos(angle)
      const y = scaledRadius * Math.sin(angle)
      points.push(`${x},${y}`)
    }

    return points.join(' ')
  }
}

export default StarPolygon
