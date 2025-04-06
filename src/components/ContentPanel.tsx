"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { InstallationStatus, Step } from "../types"
import StepsIndicator from "./StepsIndicator"
import StatusContainer from "./StatusContainer"
import ActionButtons from "./ActionButtons"

interface ContentPanelProps {
  status: InstallationStatus | null
  currentStep: Step
  showActionButtons: boolean
}

const ContentPanel: React.FC<ContentPanelProps> = ({ status, currentStep, showActionButtons }) => {
  const [isInstalling, setIsInstalling] = useState(false)

  // Reset isInstalling when status changes to success
  useEffect(() => {
    if (status?.status === "success") {
      setIsInstalling(false)
    }
  }, [status])

  const handleInstall = () => {
    if (!window.electronAPI) {
      console.log("Electron API no disponible")
      return
    }

    if (currentStep === "prerequisites") {
      setIsInstalling(true)
      window.electronAPI.installPackage()
    } else if (currentStep === "complete") {
      window.electronAPI.closeInstaller()
    } else {
      window.electronAPI.checkPrerequisites()
    }
  }

  const getButtonText = () => {
    if (isInstalling) return "Instalando..."
    if (!status) return "Verificando requisitos..."

    if (status.status === "ready") return "Instalar cordlang"
    if (status.status === "error") return "Reintentar"
    if (status.status === "success") return "Cerrar instalador"

    return "Verificando..."
  }

  const isButtonDisabled = () => {
    if (!status) return true
    return status.status === "checking" || status.status === "installing" || isInstalling
  }

  return (
    <div className="flex-1 p-6 flex flex-col justify-center items-center relative overflow-y-auto scrollbar-hidden">
      {/* Indicador de pasos horizontal (para móviles) */}
      <div className="lg:hidden w-full mb-6">
        <StepsIndicator currentStep={currentStep} orientation="horizontal" />
      </div>

      {/* Contenedor de estado */}
      {status && <StatusContainer status={status} />}

      {/* Botón principal */}
      <div className="mb-8 z-10">
        <button
          onClick={handleInstall}
          disabled={isButtonDisabled()}
          className={`px-8 py-3 rounded-md font-semibold min-w-52 relative overflow-hidden transition-all ${
            isButtonDisabled()
              ? "bg-dark-tertiary text-light-tertiary cursor-not-allowed"
              : "bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0.5"
          }`}
        >
          {!isButtonDisabled() && (
            <span className="absolute inset-0 bg-white/20 -translate-x-full hover:animate-shine" />
          )}
          {getButtonText()}
        </button>
      </div>

      {/* Botones de acción secundarios */}
      {showActionButtons && <ActionButtons />}
    </div>
  )
}

export default ContentPanel

