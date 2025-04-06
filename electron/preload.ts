import { contextBridge, ipcRenderer } from "electron"

// Exponer API segura a través del puente de contexto
contextBridge.exposeInMainWorld("electronAPI", {
  // Funciones para la instalación
  checkPrerequisites: () => ipcRenderer.send("check-prerequisites"),
  installPackage: () => ipcRenderer.send("install-package"),
  reinstallPackage: () => ipcRenderer.send("reinstall-package"),
  uninstallPackage: () => ipcRenderer.send("uninstall-package"),
  updatePackage: () => ipcRenderer.send("update-package"),
  removeInstaller: () => ipcRenderer.send("remove-installer"),

  // Funciones para la ventana
  closeInstaller: () => ipcRenderer.send("close-installer"),
  minimizeWindow: () => ipcRenderer.send("minimize-window"),
  maximizeWindow: () => ipcRenderer.send("maximize-window"),
  openExternalLink: (url: string) => ipcRenderer.send("open-external-link", url),

  // Escuchar eventos
  onInstallationStatus: (callback: (data: any) => void) => {
    const subscription = (_event: any, data: any) => callback(data)
    ipcRenderer.on("installation-status", subscription)
    return () => {
      ipcRenderer.removeListener("installation-status", subscription)
    }
  },
})

