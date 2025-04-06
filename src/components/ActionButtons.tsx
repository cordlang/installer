"use client"

import type React from "react"
import { useState } from "react"

const ActionButtons: React.FC = () => {
  const [activeButton, setActiveButton] = useState<string | null>(null)

  const handleReinstall = () => {
    if (!window.electronAPI) return
    setActiveButton("reinstall")
    window.electronAPI.reinstallPackage()
  }

  const handleUpdate = () => {
    if (!window.electronAPI) return
    setActiveButton("update")
    window.electronAPI.updatePackage()
  }

  const handleUninstall = () => {
    if (!window.electronAPI) return
    setActiveButton("uninstall")
    window.electronAPI.uninstallPackage()
  }

  const handleRemove = () => {
    if (!window.electronAPI) return
    if (confirm("¿Estás seguro de que deseas eliminar el instalador de cordlang de tu sistema?")) {
      setActiveButton("remove")
      window.electronAPI.removeInstaller()
    }
  }

  const getButtonClass = (id: string) => {
    const baseClass = "flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 border"
    const activeClass =
      activeButton === id
        ? "border-accent-primary bg-accent-primary/10 shadow-glow"
        : "border-dark-tertiary bg-dark-secondary hover:bg-dark-tertiary hover:-translate-y-1"

    if (id === "remove") {
      return `${baseClass} ${activeButton === id ? "border-error bg-error/10" : "border-dark-tertiary bg-dark-secondary hover:bg-error/5 hover:-translate-y-1"}`
    }

    return `${baseClass} ${activeClass}`
  }

  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-md z-10">
      <button onClick={handleReinstall} className={getButtonClass("reinstall")}>
        <span className="text-2xl text-accent-primary mb-2">↺</span>
        <span className="text-sm font-medium">Reinstalar</span>
      </button>

      <button onClick={handleUpdate} className={getButtonClass("update")}>
        <span className="text-2xl text-accent-primary mb-2">↑</span>
        <span className="text-sm font-medium">Actualizar</span>
      </button>

      <button onClick={handleUninstall} className={getButtonClass("uninstall")}>
        <span className="text-2xl text-accent-primary mb-2">✕</span>
        <span className="text-sm font-medium">Desinstalar</span>
      </button>

      <button onClick={handleRemove} className={getButtonClass("remove")}>
        <span className="text-2xl text-error mb-2">⚠</span>
        <span className="text-sm font-medium">Eliminar Instalador</span>
      </button>
    </div>
  )
}

export default ActionButtons

