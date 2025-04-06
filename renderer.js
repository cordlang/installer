const { ipcRenderer } = require("electron")

document.addEventListener("DOMContentLoaded", () => {
  const installBtn = document.getElementById("install-btn")
  const statusContainer = document.getElementById("status-container")
  const statusMessage = document.getElementById("status-message")
  const statusDetails = document.getElementById("status-details")
  const loader = document.getElementById("loader")
  const progressBar = document.getElementById("progress-bar")
  const backgroundDecoration = document.getElementById("background-decoration")
  const stepsVertical = document.getElementById("steps-vertical")
  const stepsHorizontal = document.getElementById("steps-horizontal")
  const actionButtons = document.getElementById("action-buttons")

  // Crear decoración de fondo
  createBackgroundDecoration()

  // Iniciar verificación de requisitos
  checkPrerequisites()

  // Configurar controles de ventana con funcionalidad real
  document.getElementById("minimize-btn").addEventListener("click", () => {
    ipcRenderer.send("minimize-window")
  })

  document.getElementById("maximize-btn").addEventListener("click", () => {
    ipcRenderer.send("maximize-window")
  })

  document.getElementById("close-btn").addEventListener("click", () => {
    ipcRenderer.send("close-installer")
  })

  // Configurar botón principal
  installBtn.addEventListener("click", () => {
    const currentStep = installBtn.dataset.step || "prerequisites"

    if (currentStep === "prerequisites") {
      // Si estamos en el paso de requisitos y se hace clic, pasar a la instalación
      installCordlang()
    } else if (currentStep === "complete") {
      // Si la instalación está completa y se hace clic, cerrar el instalador
      ipcRenderer.send("close-installer")
    } else {
      // Si estamos en un estado de error, intentar verificar los requisitos nuevamente
      checkPrerequisites()
    }
  })

  // Configurar botones de acción secundarios
  document.getElementById("reinstall-btn").addEventListener("click", () => {
    resetActionButtonStates()
    document.getElementById("reinstall-btn").classList.add("active")
    reinstallCordlang()
  })

  document.getElementById("uninstall-btn").addEventListener("click", () => {
    resetActionButtonStates()
    document.getElementById("uninstall-btn").classList.add("active")
    uninstallCordlang()
  })

  document.getElementById("update-btn").addEventListener("click", () => {
    resetActionButtonStates()
    document.getElementById("update-btn").classList.add("active")
    updateCordlang()
  })

  document.getElementById("remove-btn").addEventListener("click", () => {
    if (confirm("¿Estás seguro de que deseas eliminar el instalador de cordlang de tu sistema?")) {
      resetActionButtonStates()
      document.getElementById("remove-btn").classList.add("active")
      removeInstaller()
    }
  })

  function resetActionButtonStates() {
    const buttons = actionButtons.querySelectorAll(".action-btn")
    buttons.forEach((btn) => btn.classList.remove("active"))
  }

  function checkPrerequisites() {
    // Ocultar botones de acción durante la verificación
    actionButtons.classList.add("hidden")

    // Deshabilitar el botón durante la verificación
    installBtn.disabled = true
    installBtn.classList.add("disabled")
    installBtn.textContent = "Verificando..."
    installBtn.dataset.step = "prerequisites"

    // Mostrar el contenedor de estado
    statusContainer.classList.remove("hidden")
    statusContainer.classList.remove("success", "error")

    // Mostrar el loader
    loader.classList.remove("hidden")

    // Reiniciar la barra de progreso
    progressBar.style.width = "30%"

    // Actualizar el indicador de pasos
    updateStepsIndicator("prerequisites")

    // Enviar mensaje al proceso principal para verificar los requisitos
    ipcRenderer.send("check-prerequisites")
  }

  function installCordlang() {
    // Ocultar botones de acción durante la instalación
    actionButtons.classList.add("hidden")

    // Deshabilitar el botón durante la instalación
    installBtn.disabled = true
    installBtn.classList.add("disabled")
    installBtn.textContent = "Instalando..."
    installBtn.dataset.step = "cordlang"

    // Reiniciar el contenedor de estado
    statusContainer.classList.remove("success", "error")

    // Mostrar el loader
    loader.classList.remove("hidden")

    // Reiniciar la barra de progreso
    progressBar.style.width = "60%"

    // Actualizar el indicador de pasos
    updateStepsIndicator("cordlang")

    // Animar la barra de progreso
    let progress = 60
    const progressInterval = setInterval(() => {
      if (progress < 90) {
        progress += Math.random() * 3
        progressBar.style.width = `${Math.min(progress, 90)}%`
      }
    }, 300)

    // Enviar mensaje al proceso principal para iniciar la instalación
    ipcRenderer.send("install-package")

    // Almacenar el ID del intervalo para limpiarlo más tarde
    installBtn.dataset.progressInterval = progressInterval
  }

  function reinstallCordlang() {
    // Deshabilitar el botón durante la reinstalación
    installBtn.disabled = true
    installBtn.classList.add("disabled")

    // Reiniciar el contenedor de estado
    statusContainer.classList.remove("hidden")
    statusContainer.classList.remove("success", "error")

    // Mostrar el loader
    loader.classList.remove("hidden")

    // Reiniciar la barra de progreso
    progressBar.style.width = "30%"

    // Animar la barra de progreso
    let progress = 30
    const progressInterval = setInterval(() => {
      if (progress < 90) {
        progress += Math.random() * 3
        progressBar.style.width = `${Math.min(progress, 90)}%`
      }
    }, 300)

    // Enviar mensaje al proceso principal para reinstalar
    ipcRenderer.send("reinstall-package")

    // Almacenar el ID del intervalo para limpiarlo más tarde
    installBtn.dataset.progressInterval = progressInterval
  }

  function uninstallCordlang() {
    // Deshabilitar el botón durante la desinstalación
    installBtn.disabled = true
    installBtn.classList.add("disabled")

    // Reiniciar el contenedor de estado
    statusContainer.classList.remove("hidden")
    statusContainer.classList.remove("success", "error")

    // Mostrar el loader
    loader.classList.remove("hidden")

    // Reiniciar la barra de progreso
    progressBar.style.width = "30%"

    // Animar la barra de progreso
    let progress = 30
    const progressInterval = setInterval(() => {
      if (progress < 90) {
        progress += Math.random() * 3
        progressBar.style.width = `${Math.min(progress, 90)}%`
      }
    }, 300)

    // Enviar mensaje al proceso principal para desinstalar
    ipcRenderer.send("uninstall-package")

    // Almacenar el ID del intervalo para limpiarlo más tarde
    installBtn.dataset.progressInterval = progressInterval
  }

  function updateCordlang() {
    // Deshabilitar el botón durante la actualización
    installBtn.disabled = true
    installBtn.classList.add("disabled")

    // Reiniciar el contenedor de estado
    statusContainer.classList.remove("hidden")
    statusContainer.classList.remove("success", "error")

    // Mostrar el loader
    loader.classList.remove("hidden")

    // Reiniciar la barra de progreso
    progressBar.style.width = "30%"

    // Animar la barra de progreso
    let progress = 30
    const progressInterval = setInterval(() => {
      if (progress < 90) {
        progress += Math.random() * 3
        progressBar.style.width = `${Math.min(progress, 90)}%`
      }
    }, 300)

    // Enviar mensaje al proceso principal para actualizar
    ipcRenderer.send("update-package")

    // Almacenar el ID del intervalo para limpiarlo más tarde
    installBtn.dataset.progressInterval = progressInterval
  }

  function removeInstaller() {
    // Deshabilitar el botón durante la eliminación
    installBtn.disabled = true
    installBtn.classList.add("disabled")

    // Reiniciar el contenedor de estado
    statusContainer.classList.remove("hidden")
    statusContainer.classList.remove("success", "error")

    // Mostrar el loader
    loader.classList.remove("hidden")

    // Reiniciar la barra de progreso
    progressBar.style.width = "50%"

    // Enviar mensaje al proceso principal para eliminar el instalador
    ipcRenderer.send("remove-installer")
  }

  // Escuchar actualizaciones de estado desde el proceso principal
  ipcRenderer.on("installation-status", (event, data) => {
    statusMessage.textContent = data.message
    statusDetails.textContent = data.details

    // Actualizar el indicador de pasos según el paso actual
    updateStepsIndicator(data.step)

    if (data.status === "ready") {
      // Los requisitos se cumplen, habilitar el botón de instalación
      loader.classList.add("hidden")
      progressBar.style.width = "50%"

      installBtn.disabled = false
      installBtn.classList.remove("disabled")
      installBtn.textContent = "Instalar cordlang"
      installBtn.dataset.step = "prerequisites"

      // Ocultar botones de acción en esta etapa
      actionButtons.classList.add("hidden")
    } else if (data.status === "success") {
      // Limpiar el intervalo de progreso si existe
      if (installBtn.dataset.progressInterval) {
        clearInterval(Number.parseInt(installBtn.dataset.progressInterval))
      }

      // Completar la barra de progreso
      progressBar.style.width = "100%"

      // Ocultar el loader
      loader.classList.add("hidden")

      // Añadir clase de éxito al contenedor de estado
      statusContainer.classList.add("success")

      // Actualizar el indicador de pasos
      updateStepsIndicator("complete")

      // Habilitar el botón y cambiar el texto
      installBtn.disabled = false
      installBtn.classList.remove("disabled")
      installBtn.textContent = "Cerrar instalador"
      installBtn.dataset.step = "complete"

      // Mostrar botones de acción después de una instalación exitosa
      actionButtons.classList.remove("hidden")
    } else if (data.status === "error") {
      // Limpiar el intervalo de progreso si existe
      if (installBtn.dataset.progressInterval) {
        clearInterval(Number.parseInt(installBtn.dataset.progressInterval))
      }

      // Ocultar el loader
      loader.classList.add("hidden")

      // Añadir clase de error al contenedor de estado
      statusContainer.classList.add("error")

      // Habilitar el botón y cambiar el texto
      installBtn.disabled = false
      installBtn.classList.remove("disabled")
      installBtn.textContent = "Reintentar"
      installBtn.dataset.step = "error"

      // Ocultar botones de acción en caso de error
      actionButtons.classList.add("hidden")
    }
  })

  function updateStepsIndicator(currentStep) {
    // Definir los pasos
    const steps = [
      { id: "prerequisites", label: "Requisitos" },
      { id: "cordlang", label: "Instalación" },
      { id: "complete", label: "Completado" },
    ]

    // Limpiar los indicadores de pasos existentes
    stepsVertical.innerHTML = ""
    stepsHorizontal.innerHTML = ""

    // Crear indicadores de pasos verticales (para escritorio)
    steps.forEach((step, index) => {
      const stepElement = document.createElement("div")
      stepElement.className = "step-vertical"

      // Añadir clase activa si este es el paso actual o un paso anterior
      if (
        (currentStep === "prerequisites" && step.id === "prerequisites") ||
        (currentStep === "cordlang" && (step.id === "prerequisites" || step.id === "cordlang")) ||
        currentStep === "complete"
      ) {
        stepElement.classList.add("active")
      }

      // Añadir clase current si este es el paso actual
      if (currentStep === step.id) {
        stepElement.classList.add("current")
      }

      // Crear número de paso
      const stepNumber = document.createElement("div")
      stepNumber.className = "step-number"
      stepNumber.textContent = index + 1

      // Crear etiqueta de paso
      const stepLabel = document.createElement("div")
      stepLabel.className = "step-label"
      stepLabel.textContent = step.label

      // Añadir elementos al paso
      stepElement.appendChild(stepNumber)
      stepElement.appendChild(stepLabel)

      // Añadir paso al indicador vertical
      stepsVertical.appendChild(stepElement)
    })

    // Crear indicadores de pasos horizontales (para móviles)
    steps.forEach((step, index) => {
      const stepElement = document.createElement("div")
      stepElement.className = "step-horizontal"

      // Añadir clase activa si este es el paso actual o un paso anterior
      if (
        (currentStep === "prerequisites" && step.id === "prerequisites") ||
        (currentStep === "cordlang" && (step.id === "prerequisites" || step.id === "cordlang")) ||
        currentStep === "complete"
      ) {
        stepElement.classList.add("active")
      }

      // Añadir clase current si este es el paso actual
      if (currentStep === step.id) {
        stepElement.classList.add("current")
      }

      // Crear número de paso
      const stepNumber = document.createElement("div")
      stepNumber.className = "step-number"
      stepNumber.textContent = index + 1

      // Crear etiqueta de paso
      const stepLabel = document.createElement("div")
      stepLabel.className = "step-label"
      stepLabel.textContent = step.label

      // Añadir elementos al paso
      stepElement.appendChild(stepNumber)
      stepElement.appendChild(stepLabel)

      // Añadir paso al indicador horizontal
      stepsHorizontal.appendChild(stepElement)
    })
  }

  function createBackgroundDecoration() {
    if (!backgroundDecoration) return

    const codeSymbols = ["<>", "</>", "{...}", "()", "[]", "// code", "/* */", "=> {}", "import", "export"]

    // Ajustar el número de símbolos según el tamaño de la ventana
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const symbolCount = Math.min(20, Math.max(8, Math.floor((windowWidth * windowHeight) / 25000)))

    for (let i = 0; i < symbolCount; i++) {
      const symbol = document.createElement("div")
      symbol.className = "code-symbol"
      symbol.textContent = codeSymbols[Math.floor(Math.random() * codeSymbols.length)]

      // Posición aleatoria
      symbol.style.left = `${Math.random() * 100}%`
      symbol.style.top = `${Math.random() * 100}%`

      // Rotación aleatoria
      symbol.style.transform = `rotate(${Math.random() * 360}deg)`

      // Tamaño aleatorio - ajustado para ser más responsivo
      const size = Math.max(12, Math.min(28, 16 + Math.random() * 20))
      symbol.style.fontSize = `${size}px`

      backgroundDecoration.appendChild(symbol)
    }

    // Crear burbujas animadas
    createBubbles()
  }

  // Función para crear burbujas animadas
  function createBubbles() {
    const bubblesContainer = document.getElementById("bubbles-container")
    if (!bubblesContainer) return

    // Limpiar burbujas existentes
    bubblesContainer.innerHTML = ""

    // Determinar número de burbujas basado en el tamaño de la ventana
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const bubbleCount = Math.min(15, Math.max(5, Math.floor((windowWidth * windowHeight) / 40000)))

    for (let i = 0; i < bubbleCount; i++) {
      const bubble = document.createElement("div")
      bubble.className = `bubble bubble-${Math.floor(Math.random() * 5) + 1}`

      // Tamaño aleatorio entre 50px y 200px
      const size = Math.max(50, Math.min(200, 50 + Math.random() * 150))
      bubble.style.width = `${size}px`
      bubble.style.height = `${size}px`

      // Posición aleatoria
      bubble.style.left = `${Math.random() * 100}%`
      bubble.style.top = `${Math.random() * 100}%`

      // Duración de animación aleatoria entre 15s y 30s
      const duration = 15 + Math.random() * 15
      bubble.style.animationDuration = `${duration}s`

      // Retraso de animación aleatorio
      bubble.style.animationDelay = `${Math.random() * 5}s`

      bubblesContainer.appendChild(bubble)
    }
  }
})

// Manejar redimensionamiento de ventana
window.addEventListener("resize", () => {
  // Ajustar la decoración de fondo al redimensionar
  const backgroundDecoration = document.getElementById("background-decoration")
  if (backgroundDecoration) {
    backgroundDecoration.innerHTML = ""

    const codeSymbols = ["<>", "</>", "{...}", "()", "[]", "// code", "/* */", "=> {}", "import", "export"]

    // Ajustar el número de símbolos según el tamaño de la ventana
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const symbolCount = Math.min(20, Math.max(8, Math.floor((windowWidth * windowHeight) / 25000)))

    for (let i = 0; i < symbolCount; i++) {
      const symbol = document.createElement("div")
      symbol.className = "code-symbol"
      symbol.textContent = codeSymbols[Math.floor(Math.random() * codeSymbols.length)]

      // Posición aleatoria
      symbol.style.left = `${Math.random() * 100}%`
      symbol.style.top = `${Math.random() * 100}%`

      // Rotación aleatoria
      symbol.style.transform = `rotate(${Math.random() * 360}deg)`

      // Tamaño aleatorio - ajustado para ser más responsivo
      const size = Math.max(12, Math.min(28, 16 + Math.random() * 20))
      symbol.style.fontSize = `${size}px`

      backgroundDecoration.appendChild(symbol)
    }
  }

  // Recrear las burbujas
  createBubbles()
})

// Función global para crear burbujas (para poder llamarla desde el evento resize)
function createBubbles() {
  const bubblesContainer = document.getElementById("bubbles-container")
  if (!bubblesContainer) return

  // Limpiar burbujas existentes
  bubblesContainer.innerHTML = ""

  // Determinar número de burbujas basado en el tamaño de la ventana
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  const bubbleCount = Math.min(15, Math.max(5, Math.floor((windowWidth * windowHeight) / 40000)))

  for (let i = 0; i < bubbleCount; i++) {
    const bubble = document.createElement("div")
    bubble.className = `bubble bubble-${Math.floor(Math.random() * 5) + 1}`

    // Tamaño aleatorio entre 50px y 200px
    const size = Math.max(50, Math.min(200, 50 + Math.random() * 150))
    bubble.style.width = `${size}px`
    bubble.style.height = `${size}px`

    // Posición aleatoria
    bubble.style.left = `${Math.random() * 100}%`
    bubble.style.top = `${Math.random() * 100}%`

    // Duración de animación aleatoria entre 15s y 30s
    const duration = 15 + Math.random() * 15
    bubble.style.animationDuration = `${duration}s`

    // Retraso de animación aleatorio
    bubble.style.animationDelay = `${Math.random() * 5}s`

    bubblesContainer.appendChild(bubble)
  }
}

