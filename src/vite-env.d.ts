/// <reference types="vite/client" />

interface Window {
  electronAPI: {
    checkPrerequisites: () => void
    installPackage: () => void
    reinstallPackage: () => void
    uninstallPackage: () => void
    updatePackage: () => void
    removeInstaller: () => void
    closeInstaller: () => void
    minimizeWindow: () => void
    maximizeWindow: () => void
    openExternalLink: (url: string) => void
    onInstallationStatus: (callback: (data: any) => void) => () => void
  }
}

