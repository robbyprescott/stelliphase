import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import './Viewer.css'

function Viewer({ zoom = 1, triangleRotating = false }) {
  const [rotation, setRotation] = useState(0)
  const animationRef = useRef(null)
  const startTimeRef = useRef(null)

  useEffect(() => {
    if (triangleRotating) {
      startTimeRef.current = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTimeRef.current
        const newRotation = (elapsed / 10000) * 360 % 360 // 10 seconds for full rotation
        setRotation(newRotation)
        animationRef.current = requestAnimationFrame(animate)
      }

      animationRef.current = requestAnimationFrame(animate)

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    } else {
      setRotation(0)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [triangleRotating])

  // Calculate viewBox based on zoom level (centered on origin at 0,0)
  const baseSize = 300
  const viewBoxWidth = baseSize / zoom
  const viewBoxHeight = baseSize / zoom
  const viewBoxX = -viewBoxWidth / 2
  const viewBoxY = -viewBoxHeight / 2
  const viewBox = `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`

  return (
    <div className="viewer">
      <div className="viewer-content">
        <motion.div
          className="svg-display"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <svg viewBox={viewBox} preserveAspectRatio="xMidYMid meet">
            {/* Circle with radius 2 (scaled to 50) - Back layer */}
            <circle
              cx="0"
              cy="0"
              r="50"
              fill="#FFB3BA"
              stroke="none"
            />

            {/* Equilateral triangle with radius 2 (scaled to 50) - Middle layer */}
            <g transform={`rotate(${rotation} 0 0)`}>
              <polygon
                points="0,-50 -43.3,25 43.3,25"
                fill="#BAE1FF"
                stroke="none"
              />
            </g>

            {/* Circle with radius 1 (scaled to 25) - Front layer */}
            <circle
              cx="0"
              cy="0"
              r="25"
              fill="#E0BBE4"
              stroke="none"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  )
}

export default Viewer
