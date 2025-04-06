"use client"

import { useEffect, useState } from "react"
import TitleBar from "./components/TitleBar"
import Sidebar from "./components/Sidebar"
import ContentPanel from "./components/ContentPanel"
import Footer from "./components/Footer"
import BackgroundDecorations from "./components/BackgroundDecorations"
import type { InstallationStatus, Step } from "./types"

function App() {
  const [status, setStatus] = useState<InstallationStatus | null>(null)
  const [currentStep, setCurrentStep] = useState<Step>("prerequisites")
  const [showActionButtons, setShowActionButtons] = useState(false)

  useEffect(() => {
    // Verificar si estamos en un entorno Electron
    if (window.electronAPI) {
      // Escuchar actualizaciones de estado de instalación
      const unsubscribe = window.electronAPI.onInstallationStatus((data) => {
        console.log("Received status update:", data)
        setStatus(data)
        setCurrentStep(data.step)

        if (data.status === "success") {
          // Si la instalación es exitosa, actualizar al paso "complete"
          setCurrentStep("complete")
          setShowActionButtons(true)
        } else if (data.status === "error") {
          setShowActionButtons(false)
        }
      })

      // Iniciar verificación de requisitos
      window.electronAPI.checkPrerequisites()

      // Limpiar suscripción al desmontar
      return () => {
        unsubscribe()
      }
    } else {
      // Modo de desarrollo/fallback cuando no estamos en Electron
      console.log("Ejecutando en modo de desarrollo sin Electron")
      // Simular estado inicial para desarrollo
      setStatus({
        status: "ready",
        step: "prerequisites",
        message: "Todo listo para instalar cordlang",
        details: "Modo de desarrollo - Electron API no disponible",
      })
    }
  }, [])

  return (
    <div className="flex flex-col h-screen bg-dark-primary text-light-primary">
      <TitleBar />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar currentStep={currentStep} />

        <ContentPanel status={status} currentStep={currentStep} showActionButtons={showActionButtons} />
      </div>

      <Footer />

      <BackgroundDecorations />
    </div>
  )
}

export default App

