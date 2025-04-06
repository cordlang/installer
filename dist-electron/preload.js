"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  // Funciones para la instalación
  checkPrerequisites: () => electron.ipcRenderer.send("check-prerequisites"),
  installPackage: () => electron.ipcRenderer.send("install-package"),
  reinstallPackage: () => electron.ipcRenderer.send("reinstall-package"),
  uninstallPackage: () => electron.ipcRenderer.send("uninstall-package"),
  updatePackage: () => electron.ipcRenderer.send("update-package"),
  removeInstaller: () => electron.ipcRenderer.send("remove-installer"),
  // Funciones para la ventana
  closeInstaller: () => electron.ipcRenderer.send("close-installer"),
  minimizeWindow: () => electron.ipcRenderer.send("minimize-window"),
  maximizeWindow: () => electron.ipcRenderer.send("maximize-window"),
  openExternalLink: (url) => electron.ipcRenderer.send("open-external-link", url),
  // Escuchar eventos
  onInstallationStatus: (callback) => {
    const subscription = (_event, data) => callback(data);
    electron.ipcRenderer.on("installation-status", subscription);
    return () => {
      electron.ipcRenderer.removeListener("installation-status", subscription);
    };
  }
});
