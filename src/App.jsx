import { useState } from 'react'
import ResizableLayout from './components/ResizableLayout/ResizableLayout'
import Viewer from './components/Viewer/Viewer'
import Editor from './components/Editor/Editor'
import './App.css'

function App() {
  const [isEditorCollapsed, setIsEditorCollapsed] = useState(false)
  const [zoom, setZoom] = useState(1) // Zoom level: 1 = 100%, 2 = 200%, etc.
  const [triangleRotating, setTriangleRotating] = useState(false)

  const handleToggleEditor = () => {
    setIsEditorCollapsed(!isEditorCollapsed)
  }

  return (
    <div className="App">
      <ResizableLayout
        leftPanel={<Viewer zoom={zoom} triangleRotating={triangleRotating} />}
        rightPanel={
          <Editor
            isCollapsed={isEditorCollapsed}
            zoom={zoom}
            onZoomChange={setZoom}
            triangleRotating={triangleRotating}
            onTriangleRotatingChange={setTriangleRotating}
          />
        }
        isRightCollapsed={isEditorCollapsed}
        onToggleCollapse={handleToggleEditor}
      />
    </div>
  )
}

export default App
