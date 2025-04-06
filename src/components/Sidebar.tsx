import type React from "react"
import type { Step } from "../types"
import StepsIndicator from "./StepsIndicator"
import LogoApp from "../../assets/logo.png"

interface SidebarProps {
  currentStep: Step
}

const Sidebar: React.FC<SidebarProps> = ({ currentStep }) => {
  return (
    <div className="w-70 bg-gradient-to-b from-dark-secondary to-dark-primary p-6 flex flex-col relative lg:block hidden">
      <div className="flex flex-col items-center mb-8">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center mb-4 shadow-glow overflow-hidden">
        <img src={LogoApp} alt="Logo" className="w-16 h-16 object-contain" />
      </div>
        <h1 className="text-3xl font-bold gradient-text mb-1">cordlang</h1>
        <p className="text-xl text-light-secondary font-light">Installer</p>
      </div>

      <div className="terminal-container mb-8">
        <div className="terminal-header">
          <div className="terminal-dot bg-red-500"></div>
          <div className="terminal-dot bg-yellow-500"></div>
          <div className="terminal-dot bg-green-500"></div>
          <span className="ml-2 text-xs text-gray-400">main.cxl</span>
        </div>
        <div className="terminal-content">
          <div className="flex">
            <span className="text-purple-400 mr-2">$</span>
            <span className="typing-animation">instalando cordlang</span>
          </div>
        </div>
      </div>

      <StepsIndicator currentStep={currentStep} orientation="vertical" />
    </div>
  )
}

export default Sidebar

