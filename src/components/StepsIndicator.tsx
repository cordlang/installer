import type React from "react"
import type { Step } from "../types"

interface StepsIndicatorProps {
  currentStep: Step
  orientation: "vertical" | "horizontal"
}

const StepsIndicator: React.FC<StepsIndicatorProps> = ({ currentStep, orientation }) => {
  const steps = [
    { id: "prerequisites", label: "Requisitos" },
    { id: "cordlang", label: "Instalación" },
    { id: "complete", label: "Completado" },
  ]

  const isActive = (step: string) => {
    if (currentStep === "prerequisites" && step === "prerequisites") return true
    if (currentStep === "cordlang" && (step === "prerequisites" || step === "cordlang")) return true
    if (currentStep === "complete") return true
    return false
  }

  const isCurrent = (step: string) => currentStep === step

  if (orientation === "vertical") {
    return (
      <div className="flex flex-col gap-6 mt-8">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center gap-4 transition-opacity ${isActive(step.id) ? "opacity-100" : "opacity-50"}`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                isCurrent(step.id)
                  ? "bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-glow"
                  : isActive(step.id)
                    ? "bg-accent-primary text-white"
                    : "bg-dark-tertiary text-light-secondary"
              }`}
            >
              {index + 1}
            </div>
            <div
              className={`text-base font-medium transition-colors ${
                isActive(step.id) ? "text-light-primary font-semibold" : "text-light-secondary"
              }`}
            >
              {step.label}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex justify-between w-full">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={`flex flex-col items-center relative transition-opacity ${
            isActive(step.id) ? "opacity-100" : "opacity-50"
          }`}
        >
          {/* Línea conectora */}
          {index < steps.length - 1 && (
            <div
              className={`absolute top-3.5 w-full h-0.5 right-1/2 z-0 ${
                isActive(steps[index + 1].id) ? "bg-accent-primary" : "bg-dark-tertiary"
              }`}
            />
          )}

          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold z-10 transition-all ${
              isCurrent(step.id)
                ? "bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-glow"
                : isActive(step.id)
                  ? "bg-accent-primary text-white"
                  : "bg-dark-tertiary text-light-secondary"
            }`}
          >
            {index + 1}
          </div>
          <div
            className={`text-xs font-medium mt-1 transition-colors ${
              isActive(step.id) ? "text-light-primary font-semibold" : "text-light-secondary"
            }`}
          >
            {step.label}
          </div>
        </div>
      ))}
    </div>
  )
}

export default StepsIndicator

