import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Editor.css'

function Editor({ isCollapsed, zoom, onZoomChange, triangleRotating, onTriangleRotatingChange, rotationSpeed, onRotationSpeedChange }) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const animationRef = useRef(null)
  const animationStateRef = useRef({
    startZoom: 0,
    targetZoom: 0,
    startTime: 0,
    duration: 0,
    pausedAt: 0
  })

  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    setIsAnimating(false)
    setIsPaused(false)
  }

  const handlePlayZoom = () => {
    // If currently animating (not paused), pause it
    if (isAnimating && !isPaused) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      animationStateRef.current.pausedAt = Date.now()
      setIsPaused(true)
      return
    }

    // If paused, resume
    if (isPaused) {
      const pauseDuration = Date.now() - animationStateRef.current.pausedAt
      animationStateRef.current.startTime += pauseDuration
      setIsPaused(false)

      const animate = () => {
        const { startTime, duration, startZoom, targetZoom } = animationStateRef.current
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        const currentZoom = startZoom + (targetZoom - startZoom) * progress
        onZoomChange(currentZoom)

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        } else {
          setIsAnimating(false)
          setIsPaused(false)
        }
      }

      animationRef.current = requestAnimationFrame(animate)
      return
    }

    // Start new animation
    const minZoom = 0.1
    const maxZoom = 5
    const midpoint = (minZoom + maxZoom) / 2
    const targetZoom = zoom > midpoint ? minZoom : maxZoom
    const startZoom = zoom
    const duration = 8000 // 8 seconds
    const startTime = Date.now()

    animationStateRef.current = {
      startZoom,
      targetZoom,
      startTime,
      duration,
      pausedAt: 0
    }

    setIsAnimating(true)
    setIsPaused(false)

    const animate = () => {
      const elapsed = Date.now() - animationStateRef.current.startTime
      const progress = Math.min(elapsed / animationStateRef.current.duration, 1)

      const currentZoom = animationStateRef.current.startZoom +
        (animationStateRef.current.targetZoom - animationStateRef.current.startZoom) * progress
      onZoomChange(currentZoom)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
        setIsPaused(false)
      }
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  const handleSliderInteraction = () => {
    if (isAnimating || isPaused) {
      stopAnimation()
    }
  }

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className={`editor ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Vertical Zoom Bar - Always visible */}
      <div className="zoom-bar-vertical">
        <button
          className="play-zoom-button"
          onClick={handlePlayZoom}
          aria-label={isAnimating && !isPaused ? "Pause zoom" : "Animate zoom"}
        >
          {isAnimating && !isPaused ? '⏸' : '▶'}
        </button>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.01"
          value={zoom}
          onChange={(e) => {
            handleSliderInteraction()
            onZoomChange(parseFloat(e.target.value))
          }}
          onMouseDown={handleSliderInteraction}
          onTouchStart={handleSliderInteraction}
          className="zoom-slider-vertical"
          orient="vertical"
        />
      </div>

      <div className="editor-main">
      <div className="editor-header">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              key="header-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="editor-header-content"
            >
              <h2>SVG Editor</h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className="editor-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="editor-section">
              <h3>Properties</h3>
              <div className="property-controls">
                <div className="property-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={triangleRotating}
                      onChange={(e) => onTriangleRotatingChange(e.target.checked)}
                      style={{ marginRight: '0.5rem' }}
                    />
                    Rotate
                  </label>
                </div>
                <div className="property-group">
                  <label>Speed</label>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={rotationSpeed}
                    onChange={(e) => onRotationSpeedChange(parseFloat(e.target.value))}
                    style={{ width: '100%' }}
                  />
                  <span style={{ fontSize: '0.8rem', color: '#aaa' }}>{rotationSpeed.toFixed(1)}x</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  )
}

export default Editor
