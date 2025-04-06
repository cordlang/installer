"use strict";
const electron = require("electron");
const child_process = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");
const DIST_PATH = path.join(__dirname, "../dist");
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;
let mainWindow = null;
function createWindow() {
  const { width, height } = require("electron").screen.getPrimaryDisplay().workAreaSize;
  const windowWidth = Math.min(Math.round(width * 0.7), 1e3);
  const windowHeight = Math.min(Math.round(height * 0.8), 700);
  mainWindow = new electron.BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    minWidth: 600,
    minHeight: 500,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    },
    resizable: true,
    frame: false,
    transparent: false,
    icon: path.join(process.env.PUBLIC || path.join(__dirname, "../public"), "assets/icon.png"),
    backgroundColor: "#0a0e17",
    show: false,
    autoHideMenuBar: true
  });
  mainWindow.center();
  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(DIST_PATH, "index.html"));
  }
  mainWindow.once("ready-to-show", () => {
    mainWindow == null ? void 0 : mainWindow.show();
    mainWindow == null ? void 0 : mainWindow.setOpacity(0);
    let opacity = 0;
    const fadeIn = setInterval(() => {
      opacity += 0.1;
      if (opacity >= 1) {
        clearInterval(fadeIn);
        opacity = 1;
      }
      mainWindow == null ? void 0 : mainWindow.setOpacity(opacity);
    }, 20);
  });
}
function checkNodejs() {
  return new Promise((resolve) => {
    child_process.exec("node --version", (error) => {
      if (error) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}
function checkNvm() {
  return new Promise((resolve) => {
    const platform = process.platform;
    let nvmPath;
    if (platform === "win32") {
      nvmPath = path.join(process.env.APPDATA || "", "nvm", "nvm.exe");
      fs.access(nvmPath, fs.constants.F_OK, (err) => {
        resolve(!err);
      });
    } else {
      const homeDir = os.homedir();
      nvmPath = path.join(homeDir, ".nvm", "nvm.sh");
      fs.access(nvmPath, fs.constants.F_OK, (err) => {
        if (err) {
          const altPath = path.join(homeDir, ".nvm");
          fs.access(altPath, fs.constants.F_OK, (altErr) => {
            resolve(!altErr);
          });
        } else {
          resolve(true);
        }
      });
    }
  });
}
function installNodejs() {
  return new Promise((resolve, reject) => {
    const platform = process.platform;
    let command;
    if (platform === "win32") {
      const tempDir = os.tmpdir();
      const installerPath = path.join(tempDir, "node_installer.msi");
      command = `powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi' -OutFile '${installerPath}'" && msiexec /i "${installerPath}" /quiet`;
    } else if (platform === "darwin") {
      command = '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" && brew install node';
    } else {
      command = "sudo apt-get update && sudo apt-get install -y nodejs npm";
    }
    child_process.exec(command, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
function installNvm() {
  return new Promise((resolve, reject) => {
    const platform = process.platform;
    let command;
    if (platform === "win32") {
      const tempDir = os.tmpdir();
      const installerPath = path.join(tempDir, "nvm-setup.exe");
      command = `powershell -Command "Invoke-WebRequest -Uri 'https://github.com/coreybutler/nvm-windows/releases/download/1.1.11/nvm-setup.exe' -OutFile '${installerPath}'" && "${installerPath}" /SILENT`;
    } else {
      command = "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash";
    }
    child_process.exec(command, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
electron.app.whenReady().then(() => {
  createWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.ipcMain.on("check-prerequisites", async (event) => {
  try {
    const webContents = event.sender;
    webContents.send("installation-status", {
      status: "checking",
      step: "prerequisites",
      message: "Comprobando implementos...",
      details: "Verificando si Node.js o NVM están instalados"
    });
    const hasNodejs = await checkNodejs();
    const hasNvm = await checkNvm();
    if (hasNodejs || hasNvm) {
      const webContents2 = event.sender;
      webContents2.send("installation-status", {
        status: "ready",
        step: "prerequisites",
        message: "Todo listo para instalar cordlang",
        details: hasNodejs ? "Node.js encontrado en el sistema" : "NVM encontrado en el sistema"
      });
    } else {
      const webContents2 = event.sender;
      webContents2.send("installation-status", {
        status: "installing",
        step: "prerequisites",
        message: "Instalando complementos...",
        details: "Instalando Node.js para continuar con la instalación"
      });
      try {
        await installNodejs();
        const webContents3 = event.sender;
        webContents3.send("installation-status", {
          status: "ready",
          step: "prerequisites",
          message: "Todo listo para instalar cordlang",
          details: "Node.js ha sido instalado correctamente"
        });
      } catch (error) {
        const webContents3 = event.sender;
        webContents3.send("installation-status", {
          status: "installing",
          step: "prerequisites",
          message: "Instalando complementos...",
          details: "Instalando NVM como alternativa"
        });
        try {
          await installNvm();
          const webContents4 = event.sender;
          webContents4.send("installation-status", {
            status: "ready",
            step: "prerequisites",
            message: "Todo listo para instalar cordlang",
            details: "NVM ha sido instalado correctamente"
          });
        } catch (nvmError) {
          const webContents4 = event.sender;
          webContents4.send("installation-status", {
            status: "error",
            step: "prerequisites",
            message: "Error al instalar los requisitos",
            details: "No se pudo instalar Node.js ni NVM. Por favor, instálelos manualmente."
          });
        }
      }
    }
  } catch (error) {
    const webContents = event.sender;
    webContents.send("installation-status", {
      status: "error",
      step: "prerequisites",
      message: "Error al verificar los requisitos",
      details: error.message
    });
  }
});
electron.ipcMain.on("install-package", (event) => {
  const command = "npm i -g cordlang";
  const webContents = event.sender;
  webContents.send("installation-status", {
    status: "installing",
    step: "cordlang",
    message: "Instalando cordlang...",
    details: "Descargando e instalando los archivos necesarios"
  });
  setTimeout(() => {
    child_process.exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        const webContents3 = event.sender;
        webContents3.send("installation-status", {
          status: "error",
          step: "cordlang",
          message: "Error al instalar cordlang",
          details: error.message
        });
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
      }
      console.log(`stdout: ${stdout}`);
      const webContents2 = event.sender;
      webContents2.send("installation-status", {
        status: "success",
        step: "cordlang",
        message: "¡cordlang ha sido instalado correctamente!",
        details: "Ya puedes comenzar a utilizar cordlang en tu sistema"
      });
    });
  }, 1500);
});
electron.ipcMain.on("reinstall-package", (event) => {
  const command = "npm uninstall -g cordlang && npm i -g cordlang";
  const webContents = event.sender;
  webContents.send("installation-status", {
    status: "installing",
    step: "cordlang",
    message: "Reinstalando cordlang...",
    details: "Desinstalando la versión actual y reinstalando"
  });
  child_process.exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      const webContents3 = event.sender;
      webContents3.send("installation-status", {
        status: "error",
        step: "cordlang",
        message: "Error al reinstalar cordlang",
        details: error.message
      });
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
    const webContents2 = event.sender;
    webContents2.send("installation-status", {
      status: "success",
      step: "cordlang",
      message: "¡cordlang ha sido reinstalado correctamente!",
      details: "La reinstalación se ha completado con éxito"
    });
  });
});
electron.ipcMain.on("uninstall-package", (event) => {
  const command = "npm uninstall -g cordlang";
  const webContents = event.sender;
  webContents.send("installation-status", {
    status: "installing",
    step: "cordlang",
    message: "Desinstalando cordlang...",
    details: "Eliminando cordlang del sistema"
  });
  child_process.exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      const webContents3 = event.sender;
      webContents3.send("installation-status", {
        status: "error",
        step: "cordlang",
        message: "Error al desinstalar cordlang",
        details: error.message
      });
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
    const webContents2 = event.sender;
    webContents2.send("installation-status", {
      status: "success",
      step: "cordlang",
      message: "¡cordlang ha sido desinstalado correctamente!",
      details: "La desinstalación se ha completado con éxito"
    });
  });
});
electron.ipcMain.on("update-package", (event) => {
  const command = "npm i -g cordlang@latest";
  const webContents = event.sender;
  webContents.send("installation-status", {
    status: "installing",
    step: "cordlang",
    message: "Actualizando cordlang...",
    details: "Descargando e instalando la última versión"
  });
  child_process.exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      const webContents3 = event.sender;
      webContents3.send("installation-status", {
        status: "error",
        step: "cordlang",
        message: "Error al actualizar cordlang",
        details: error.message
      });
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
    const webContents2 = event.sender;
    webContents2.send("installation-status", {
      status: "success",
      step: "cordlang",
      message: "¡cordlang ha sido actualizado correctamente!",
      details: "La actualización se ha completado con éxito"
    });
  });
});
electron.ipcMain.on("remove-installer", (event) => {
  const appPath = electron.app.getAppPath();
  const platform = process.platform;
  let command;
  if (platform === "win32") {
    const tempDir = os.tmpdir();
    const batchPath = path.join(tempDir, "remove_cordlang_installer.bat");
    const batchContent = `
@echo off
timeout /t 1 /nobreak > nul
rmdir /s /q "${appPath}"
del "%~f0"
    `;
    fs.writeFileSync(batchPath, batchContent);
    command = `start cmd.exe /c "${batchPath}"`;
  } else {
    command = `rm -rf "${appPath}"`;
  }
  const webContents = event.sender;
  webContents.send("installation-status", {
    status: "installing",
    step: "cordlang",
    message: "Eliminando el instalador...",
    details: "El instalador se eliminará al cerrar la aplicación"
  });
  setTimeout(() => {
    child_process.exec(command, (error) => {
      if (error) {
        console.error(`Error removing installer: ${error.message}`);
      }
      electron.app.quit();
    });
  }, 1500);
});
electron.ipcMain.on("close-installer", () => {
  electron.app.quit();
});
electron.ipcMain.on("minimize-window", () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});
electron.ipcMain.on("maximize-window", () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});
electron.ipcMain.on("open-external-link", (_event, url) => {
  if (url.startsWith("https://") || url.startsWith("http://")) {
    electron.shell.openExternal(url);
  }
});
