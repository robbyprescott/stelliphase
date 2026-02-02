import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef, useMemo } from 'react'
import ShapeSequence from '../ShapeSequence/ShapeSequence'
import './Viewer.css'

function Viewer({ zoom = 1, triangleRotating = false, rotationSpeed = 1 }) {
  const [rotation, setRotation] = useState(0)
  const [showZoom, setShowZoom] = useState(false)
  const animationRef = useRef(null)
  const startTimeRef = useRef(null)
  const zoomTimeoutRef = useRef(null)

  // Create shape sequence
  // const shapeSequence = useMemo(() => {
  //   const sequence = new ShapeSequence({ currentRadius: 50 })
  //   sequence.circle()
  //   sequence.nest(3)
  //   sequence.circle()
  //   return sequence
  // }, [])

  const shapeSequence = useMemo(() => {
    const sequence = new ShapeSequence({ currentRadius: 50 })
    sequence.circle()
    sequence.nest(7)
    sequence.star(7, 2)
    sequence.nest(7)
    sequence.star(7, 3)
    sequence.circle()
    return sequence
  }, [])

  useEffect(() => {
    if (triangleRotating) {
      // Calculate the starting point based on current rotation
      const rotationOffset = rotation
      startTimeRef.current = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTimeRef.current
        const newRotation = (rotationOffset + (elapsed / (10000 / rotationSpeed)) * 360) % 360 // 10 seconds for full rotation at 1x speed
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
      // Just stop the animation, don't reset rotation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [triangleRotating, rotation, rotationSpeed])

  useEffect(() => {
    // Show zoom display when zoom changes
    setShowZoom(true)

    // Clear any existing timeout
    if (zoomTimeoutRef.current) {
      clearTimeout(zoomTimeoutRef.current)
    }

    // Hide zoom display after 2 seconds
    zoomTimeoutRef.current = setTimeout(() => {
      setShowZoom(false)
    }, 2000)

    return () => {
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current)
      }
    }
  }, [zoom])

  // Calculate viewBox based on zoom level (centered on origin at 0,0)
  const baseSize = 100000000
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
            {(() => {
              // Update all polygon rotations before rendering
              for (let i = 0; i < shapeSequence.shapes.length; i++) {
                const shape = shapeSequence.getShape(i)
                // Check if shape is a RegularPolygon (has nSides property)
                if (shape.nSides !== undefined) {
                  // Store the initial rotation as baseRotation if not already set
                  if (shape.baseRotation === undefined) {
                    shape.baseRotation = shape.rotation
                  }
                  // Apply animated rotation on top of base rotation (convert degrees to radians)
                  shape.rotation = shape.baseRotation + (rotation * Math.PI / 180)
                }
              }
              return shapeSequence.render(1000)
            })()}
          </svg>
        </motion.div>

        {/* Zoom Display */}
        <AnimatePresence>
          {showZoom && (
            <motion.div
              className="zoom-display"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              {(zoom * 100).toFixed(0)}%
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Viewer
