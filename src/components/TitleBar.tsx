"use client"

import type React from "react"

const TitleBar: React.FC = () => {
  const handleMinimize = () => {
    if (window.electronAPI) {
      window.electronAPI.minimizeWindow()
    }
  }

  const handleMaximize = () => {
    if (window.electronAPI) {
      window.electronAPI.maximizeWindow()
    }
  }

  const handleClose = () => {
    if (window.electronAPI) {
      window.electronAPI.closeInstaller()
    }
  }

  return (
    <div className="h-10 bg-dark-primary border-b border-dark-tertiary flex items-center justify-between px-4 relative z-10">
      <div className="flex items-center">
        <span className="text-accent-primary font-semibold text-sm">cordlang installer</span>
      </div>

      <div className="absolute inset-0 drag-region"></div>

      <div className="flex items-center gap-1 z-10 no-drag">
        <button
          onClick={handleMinimize}
          className="w-3 h-3 rounded-full bg-warning relative hover:after:opacity-100 cursor-pointer"
          title="Minimizar"
          aria-label="Minimizar"
        >
          <span className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <span className="w-1.5 h-0.5 bg-black/50 rounded-full"></span>
          </span>
        </button>

        <button
          onClick={handleMaximize}
          className="w-3 h-3 rounded-full bg-success relative hover:after:opacity-100 cursor-pointer"
          title="Maximizar"
          aria-label="Maximizar"
        >
          <span className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <span className="w-1.5 h-1.5 border border-black/50 rounded-sm"></span>
          </span>
        </button>

        <button
          onClick={handleClose}
          className="w-3 h-3 rounded-full bg-error relative hover:after:opacity-100 cursor-pointer"
          title="Cerrar"
          aria-label="Cerrar"
        >
          <span className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <span className="text-xs text-black/50">×</span>
          </span>
        </button>
      </div>
    </div>
  )
}

export default TitleBar

