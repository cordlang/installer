import type React from "react"
import type { InstallationStatus } from "../types"

interface StatusContainerProps {
  status: InstallationStatus
}

const StatusContainer: React.FC<StatusContainerProps> = ({ status }) => {
  const getStatusClass = () => {
    if (status.status === "success") return "border-success bg-success/10"
    if (status.status === "error") return "border-error bg-error/10"
    return "border-dark-tertiary"
  }

  const getProgressWidth = () => {
    switch (status.status) {
      case "checking":
        return "30%"
      case "ready":
        return "50%"
      case "installing":
        return status.step === "prerequisites" ? "60%" : "80%"
      case "success":
        return "100%"
      case "error":
        return "30%"
      default:
        return "0%"
    }
  }

  return (
    <div
      className={`w-full max-w-md bg-dark-secondary rounded-xl p-5 mb-8 shadow-md transition-all border ${getStatusClass()} z-10`}
    >
      <div className="flex items-center gap-5 mb-5">
        {(status.status === "checking" || status.status === "installing") && (
          <div className="w-10 h-10 rounded-full border-3 border-dark-tertiary border-t-accent-primary animate-spin shrink-0" />
        )}

        {status.status === "success" && (
          <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center text-white text-xl shrink-0">
            ✓
          </div>
        )}

        {status.status === "error" && (
          <div className="w-10 h-10 rounded-full bg-error flex items-center justify-center text-white text-xl shrink-0">
            !
          </div>
        )}

        {status.status === "ready" && (
          <div className="w-10 h-10 rounded-full bg-accent-primary flex items-center justify-center text-white text-xl shrink-0">
            →
          </div>
        )}

        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-1 text-light-primary">{status.message}</h2>
          <p className="text-sm text-light-tertiary">{status.details}</p>
        </div>
      </div>

      <div className="h-1.5 bg-dark-tertiary rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary transition-all duration-500 ease-out"
          style={{ width: getProgressWidth() }}
        />
      </div>
    </div>
  )
}

export default StatusContainer

