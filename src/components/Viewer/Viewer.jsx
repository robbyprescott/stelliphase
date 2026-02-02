import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import RegularPolygon from '../RegularPolygon/RegularPolygon'
import './Viewer.css'

function Viewer({ zoom = 1, triangleRotating = false, rotationSpeed = 1 }) {
  const [rotation, setRotation] = useState(0)
  const [showZoom, setShowZoom] = useState(false)
  const animationRef = useRef(null)
  const startTimeRef = useRef(null)
  const zoomTimeoutRef = useRef(null)

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
  const baseSize = 300000
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
            {/* Circle with radius 2 (scaled to 50000) - Back layer */}
            <circle
              cx="0"
              cy="0"
              r="50000"
              fill="#FFB3BA"
              stroke="none"
            />

            {/* Regular polygon - Middle layer */}
            <RegularPolygon
              nSides={6}
              radius={50000}
              rotation={rotation}
              fill="#BAE1FF"
            />

            {/* Circle with radius 1 (scaled to 25000) - Front layer */}
            <circle
              cx="0"
              cy="0"
              r="25000"
              fill="#E0BBE4"
              stroke="none"
            />
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
