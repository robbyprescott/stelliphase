import { useState, useCallback, useRef, useEffect } from 'react'
import './ResizableLayout.css'

function ResizableLayout({ leftPanel, rightPanel, isRightCollapsed = false, onToggleCollapse }) {
  const [leftWidth, setLeftWidth] = useState(60) // percentage
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef(null)
  const collapsedWidth = 50 // pixels when collapsed

  const handleMouseDown = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !containerRef.current) return

    const container = containerRef.current
    const containerRect = container.getBoundingClientRect()
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100

    // Constrain between 20% and 80%
    const constrainedWidth = Math.min(Math.max(newLeftWidth, 20), 80)
    setLeftWidth(constrainedWidth)
  }, [isDragging])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <div className="resizable-layout" ref={containerRef}>
      <div
        className="resizable-panel left-panel"
        style={{
          width: isRightCollapsed ? `calc(100% - ${collapsedWidth}px - 8px)` : `${leftWidth}%`,
          transition: 'width 0.3s ease-in-out'
        }}
      >
        {leftPanel}
      </div>

      <div
        className="resizer"
        onMouseDown={handleMouseDown}
        role="separator"
        aria-label="Resize panels"
        style={{
          opacity: isRightCollapsed ? 0 : 1,
          pointerEvents: isRightCollapsed ? 'none' : 'auto',
          transition: 'opacity 0.3s ease-in-out'
        }}
      >
        <div className="resizer-handle" />
        <button
          className="collapse-button-resizer"
          onClick={(e) => {
            e.stopPropagation()
            onToggleCollapse()
          }}
          aria-label={isRightCollapsed ? 'Expand editor' : 'Collapse editor'}
        >
          {isRightCollapsed ? '◀' : '▶'}
        </button>
      </div>

      <div
        className="resizable-panel right-panel"
        style={{
          width: isRightCollapsed ? `${collapsedWidth}px` : `${100 - leftWidth}%`,
          transition: 'width 0.3s ease-in-out'
        }}
      >
        {rightPanel}
      </div>
    </div>
  )
}

export default ResizableLayout
