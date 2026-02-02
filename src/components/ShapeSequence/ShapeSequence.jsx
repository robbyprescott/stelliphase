import RegularPolygon from '../RegularPolygon/RegularPolygon'
import Circle from '../Circle/Circle'
import ColorUtilities from '../ColorUtilities/ColorUtilities'

class ShapeSequence {
  constructor({ shapes = [], currentRadius = 1 } = {}) {
    this.shapes = shapes
    this.currentRadius = currentRadius
    this.isFlipped = false
  }

  addShape(shape) {
    this.shapes.push(shape)
  }

  getShape(index) {
    return this.shapes[index]
  }

  rotationCorrection(nSides) {
    // Correction to make regular polygon symmetric about y-axis
    return Math.PI / (2 * nSides)
  }

  nest(nSides) {
    // Update current radius
    this.currentRadius = this.currentRadius * (1 / Math.cos(Math.PI / nSides))

    // Calculate rotation with fixed base (not dependent on shapes.length)
    let rotation = Math.PI / (2 * nSides)

    // Apply rotation correction for y-axis symmetry
    rotation -= this.rotationCorrection(nSides)

    // If flipped, add 180 degrees (Math.PI radians)
    if (this.isFlipped) {
      rotation += Math.PI
    }

    // Create and add new polygon
    const polygon = new RegularPolygon({
      nSides: nSides,
      radius: this.currentRadius,
      rotation: rotation,
      fill: this.getPastel()
    })

    this.addShape(polygon)

    // Flip the boolean after creating the polygon
    this.isFlipped = !this.isFlipped
  }

  circle() {
    // Create and add circle with current radius
    const circle = new Circle({
      radius: this.currentRadius,
      fill: this.getPastel()
    })

    this.addShape(circle)
  }

  getPastel() {
    // Find the most recent shape with a fill color
    let previousHue = null
    for (let i = this.shapes.length - 1; i >= 0; i--) {
      if (this.shapes[i].fill) {
        previousHue = ColorUtilities.hexToHue(this.shapes[i].fill)
        break
      }
    }

    let hue
    if (previousHue === null) {
      // No previous color, choose random hue
      hue = Math.random() * 360
    } else {
      // Choose a hue at least 20 degrees away (1/4 of color wheel)
      const offset = 40 + Math.random() * 280 // 40 to 320 degrees
      hue = (previousHue + offset) % 360
    }

    // Generate pastel color with the hue
    const saturation = 30 + Math.random() * 20 // 30% to 50% saturation
    const lightness = 40 + Math.random() * 25  // 40% to 65% lightness

    return ColorUtilities.hslToHex(hue, saturation, lightness)
  }

  render(baseSize = 1) {
    return [...this.shapes].reverse().map((shape, index) => (
      <g key={index}>
        {shape.render(baseSize)}
      </g>
    ))
  }
}

export default ShapeSequence
