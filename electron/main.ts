import { app, BrowserWindow, ipcMain, shell } from "electron"
import { exec } from "child_process"
import path from "path"
import fs from "fs"
import os from "os"

// El archivo HTML principal
const DIST_PATH = path.join(__dirname, "../dist")
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

let mainWindow: BrowserWindow | null = null

function createWindow() {
  // Obtener el tamaño de la pantalla principal
  const { width, height } = require("electron").screen.getPrimaryDisplay().workAreaSize

  // Calcular dimensiones responsivas (70% del ancho de pantalla, 80% del alto)
  const windowWidth = Math.min(Math.round(width * 0.7), 1000)
  const windowHeight = Math.min(Math.round(height * 0.8), 700)

  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    minWidth: 600,
    minHeight: 500,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    resizable: true,
    frame: false,
    transparent: false,
    icon: path.join(process.env.PUBLIC || path.join(__dirname, "../public"), "assets/icon.png"),
    backgroundColor: "#0a0e17",
    show: false,
    autoHideMenuBar: true,
  })

  // Centrar la ventana en la pantalla
  mainWindow.center()

  // Cargar la aplicación
  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(DIST_PATH, "index.html"))
  }

  // Show window when ready to avoid flickering
  mainWindow.once("ready-to-show", () => {
    mainWindow?.show()

    // Add a subtle fade-in effect
    mainWindow?.setOpacity(0)
    let opacity = 0
    const fadeIn = setInterval(() => {
      opacity += 0.1
      if (opacity >= 1) {
        clearInterval(fadeIn)
        opacity = 1
      }
      mainWindow?.setOpacity(opacity)
    }, 20)
  })

  // Abrir DevTools en desarrollo
  if (VITE_DEV_SERVER_URL) {
    // mainWindow.webContents.openDevTools()
  }
}

// Esta función verificará si Node.js está instalado
function checkNodejs(): Promise<boolean> {
  return new Promise((resolve) => {
    exec("node --version", (error) => {
      if (error) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

// Esta función verificará si NVM está instalado
function checkNvm(): Promise<boolean> {
  return new Promise((resolve) => {
    const platform = process.platform
    let nvmPath

    if (platform === "win32") {
      // Windows: Check for NVM for Windows
      nvmPath = path.join(process.env.APPDATA || "", "nvm", "nvm.exe")
      fs.access(nvmPath, fs.constants.F_OK, (err) => {
        resolve(!err)
      })
    } else {
      // macOS/Linux: Check for NVM
      const homeDir = os.homedir()
      nvmPath = path.join(homeDir, ".nvm", "nvm.sh")
      fs.access(nvmPath, fs.constants.F_OK, (err) => {
        if (err) {
          // Try alternative location
          const altPath = path.join(homeDir, ".nvm")
          fs.access(altPath, fs.constants.F_OK, (altErr) => {
            resolve(!altErr)
          })
        } else {
          resolve(true)
        }
      })
    }
  })
}

// Esta función instalará Node.js
function installNodejs(): Promise<void> {
  return new Promise((resolve, reject) => {
    const platform = process.platform
    let command

    if (platform === "win32") {
      // Windows: Download and run Node.js installer
      const tempDir = os.tmpdir()
      const installerPath = path.join(tempDir, "node_installer.msi")

      // Download Node.js installer
      command = `powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi' -OutFile '${installerPath}'" && msiexec /i "${installerPath}" /quiet`
    } else if (platform === "darwin") {
      // macOS: Use Homebrew
      command =
        '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" && brew install node'
    } else {
      // Linux: Use apt or similar
      command = "sudo apt-get update && sudo apt-get install -y nodejs npm"
    }

    exec(command, (error) => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

// Esta función instalará NVM
function installNvm(): Promise<void> {
  return new Promise((resolve, reject) => {
    const platform = process.platform
    let command

    if (platform === "win32") {
      // Windows: Download and run NVM for Windows installer
      const tempDir = os.tmpdir()
      const installerPath = path.join(tempDir, "nvm-setup.exe")

      command = `powershell -Command "Invoke-WebRequest -Uri 'https://github.com/coreybutler/nvm-windows/releases/download/1.1.11/nvm-setup.exe' -OutFile '${installerPath}'" && "${installerPath}" /SILENT`
    } else {
      // macOS/Linux: Use curl installer
      command = "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash"
    }

    exec(command, (error) => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

// Iniciar la aplicación cuando Electron esté listo
app.whenReady().then(() => {
  createWindow()

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Salir cuando todas las ventanas estén cerradas (excepto en macOS)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

// Verificar requisitos previos
ipcMain.on("check-prerequisites", async (event) => {
  try {
    const webContents = event.sender
    webContents.send("installation-status", {
      status: "checking",
      step: "prerequisites",
      message: "Comprobando implementos...",
      details: "Verificando si Node.js o NVM están instalados",
    })

    // Check for Node.js and NVM
    const hasNodejs = await checkNodejs()
    const hasNvm = await checkNvm()

    if (hasNodejs || hasNvm) {
      // Prerequisites are met
      const webContents = event.sender
      webContents.send("installation-status", {
        status: "ready",
        step: "prerequisites",
        message: "Todo listo para instalar cordlang",
        details: hasNodejs ? "Node.js encontrado en el sistema" : "NVM encontrado en el sistema",
      })
    } else {
      // Need to install prerequisites
      const webContents = event.sender
      webContents.send("installation-status", {
        status: "installing",
        step: "prerequisites",
        message: "Instalando complementos...",
        details: "Instalando Node.js para continuar con la instalación",
      })

      try {
        // Try to install Node.js (preferred over NVM for simplicity)
        await installNodejs()

        const webContents = event.sender
        webContents.send("installation-status", {
          status: "ready",
          step: "prerequisites",
          message: "Todo listo para instalar cordlang",
          details: "Node.js ha sido instalado correctamente",
        })
      } catch (error) {
        // If Node.js installation fails, try NVM
        const webContents = event.sender
        webContents.send("installation-status", {
          status: "installing",
          step: "prerequisites",
          message: "Instalando complementos...",
          details: "Instalando NVM como alternativa",
        })

        try {
          await installNvm()
          const webContents = event.sender
          webContents.send("installation-status", {
            status: "ready",
            step: "prerequisites",
            message: "Todo listo para instalar cordlang",
            details: "NVM ha sido instalado correctamente",
          })
        } catch (nvmError) {
          const webContents = event.sender
          webContents.send("installation-status", {
            status: "error",
            step: "prerequisites",
            message: "Error al instalar los requisitos",
            details: "No se pudo instalar Node.js ni NVM. Por favor, instálelos manualmente.",
          })
        }
      }
    }
  } catch (error: any) {
    const webContents = event.sender
    webContents.send("installation-status", {
      status: "error",
      step: "prerequisites",
      message: "Error al verificar los requisitos",
      details: error.message,
    })
  }
})

// Instalar cordlang
ipcMain.on("install-package", (event) => {
  const command = "npm i -g cordlang"

  const webContents = event.sender
  webContents.send("installation-status", {
    status: "installing",
    step: "cordlang",
    message: "Instalando cordlang...",
    details: "Descargando e instalando los archivos necesarios",
  })

  // Add a small delay to make the installation feel more substantial
  setTimeout(() => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`)
        const webContents = event.sender
        webContents.send("installation-status", {
          status: "error",
          step: "cordlang",
          message: "Error al instalar cordlang",
          details: error.message,
        })
        return
      }

      if (stderr) {
        console.log(`stderr: ${stderr}`)
      }

      console.log(`stdout: ${stdout}`)
      const webContents = event.sender
      webContents.send("installation-status", {
        status: "success",
        step: "cordlang",
        message: "¡cordlang ha sido instalado correctamente!",
        details: "Ya puedes comenzar a utilizar cordlang en tu sistema",
      })
    })
  }, 1500)
})

// Reinstalar cordlang
ipcMain.on("reinstall-package", (event) => {
  const command = "npm uninstall -g cordlang && npm i -g cordlang"

  const webContents = event.sender
  webContents.send("installation-status", {
    status: "installing",
    step: "cordlang",
    message: "Reinstalando cordlang...",
    details: "Desinstalando la versión actual y reinstalando",
  })

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`)
      const webContents = event.sender
      webContents.send("installation-status", {
        status: "error",
        step: "cordlang",
        message: "Error al reinstalar cordlang",
        details: error.message,
      })
      return
    }

    if (stderr) {
      console.log(`stderr: ${stderr}`)
    }

    console.log(`stdout: ${stdout}`)
    const webContents = event.sender
    webContents.send("installation-status", {
      status: "success",
      step: "cordlang",
      message: "¡cordlang ha sido reinstalado correctamente!",
      details: "La reinstalación se ha completado con éxito",
    })
  })
})

// Desinstalar cordlang
ipcMain.on("uninstall-package", (event) => {
  const command = "npm uninstall -g cordlang"

  const webContents = event.sender
  webContents.send("installation-status", {
    status: "installing",
    step: "cordlang",
    message: "Desinstalando cordlang...",
    details: "Eliminando cordlang del sistema",
  })

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`)
      const webContents = event.sender
      webContents.send("installation-status", {
        status: "error",
        step: "cordlang",
        message: "Error al desinstalar cordlang",
        details: error.message,
      })
      return
    }

    if (stderr) {
      console.log(`stderr: ${stderr}`)
    }

    console.log(`stdout: ${stdout}`)
    const webContents = event.sender
    webContents.send("installation-status", {
      status: "success",
      step: "cordlang",
      message: "¡cordlang ha sido desinstalado correctamente!",
      details: "La desinstalación se ha completado con éxito",
    })
  })
})

// Actualizar cordlang
ipcMain.on("update-package", (event) => {
  const command = "npm i -g cordlang@latest"

  const webContents = event.sender
  webContents.send("installation-status", {
    status: "installing",
    step: "cordlang",
    message: "Actualizando cordlang...",
    details: "Descargando e instalando la última versión",
  })

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`)
      const webContents = event.sender
      webContents.send("installation-status", {
        status: "error",
        step: "cordlang",
        message: "Error al actualizar cordlang",
        details: error.message,
      })
      return
    }

    if (stderr) {
      console.log(`stderr: ${stderr}`)
    }

    console.log(`stdout: ${stdout}`)
    const webContents = event.sender
    webContents.send("installation-status", {
      status: "success",
      step: "cordlang",
      message: "¡cordlang ha sido actualizado correctamente!",
      details: "La actualización se ha completado con éxito",
    })
  })
})

// Eliminar el instalador
ipcMain.on("remove-installer", (event) => {
  const appPath = app.getAppPath()
  const platform = process.platform
  let command

  if (platform === "win32") {
    // On Windows, we need to use a batch file to delete the installer after it exits
    const tempDir = os.tmpdir()
    const batchPath = path.join(tempDir, "remove_cordlang_installer.bat")

    // Create a batch file that waits for the process to exit and then deletes the folder
    const batchContent = `
@echo off
timeout /t 1 /nobreak > nul
rmdir /s /q "${appPath}"
del "%~f0"
    `

    fs.writeFileSync(batchPath, batchContent)
    command = `start cmd.exe /c "${batchPath}"`
  } else {
    // On macOS/Linux
    command = `rm -rf "${appPath}"`
  }

  const webContents = event.sender
  webContents.send("installation-status", {
    status: "installing",
    step: "cordlang",
    message: "Eliminando el instalador...",
    details: "El instalador se eliminará al cerrar la aplicación",
  })

  setTimeout(() => {
    exec(command, (error) => {
      if (error) {
        console.error(`Error removing installer: ${error.message}`)
      }
      app.quit()
    })
  }, 1500)
})

// Cerrar el instalador
ipcMain.on("close-installer", () => {
  app.quit()
})

// Minimizar la ventana
ipcMain.on("minimize-window", () => {
  if (mainWindow) {
    mainWindow.minimize()
  }
})

// Maximizar/restaurar la ventana
ipcMain.on("maximize-window", () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  }
})

// Abrir enlaces en el navegador predeterminado
ipcMain.on("open-external-link", (_event, url) => {
  // Validar la URL para evitar problemas de seguridad
  if (url.startsWith("https://") || url.startsWith("http://")) {
    shell.openExternal(url)
  }
})

