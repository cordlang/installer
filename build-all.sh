#!/bin/bash

# Script para compilar el instalador de cordlang para Windows, macOS y Linux usando Docker
# Autor: v0
# Fecha: 2025-04-05

set -e # Detener el script si ocurre algún error

# Colores para la salida
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir mensajes con formato
print_message() {
  echo -e "${BLUE}[CORDLANG BUILDER]${NC} $1"
}

print_success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Verificar que Docker esté instalado
if ! command -v docker &> /dev/null; then
  print_error "Docker no está instalado. Por favor, instala Docker antes de continuar."
  exit 1
fi

# Crear directorios de salida si no existen
mkdir -p build/win
mkdir -p build/mac
mkdir -p build/linux

print_message "Iniciando compilación multiplataforma para cordlang installer..."

# Función para limpiar recursos al salir
cleanup() {
  print_message "Limpiando recursos temporales..."
  # Eliminar contenedores e imágenes temporales si es necesario
  docker container prune -f > /dev/null 2>&1
  print_message "Limpieza completada."
}

# Registrar la función de limpieza para ejecutarse al salir
trap cleanup EXIT

# Compilación para Windows
build_windows() {
  print_message "Iniciando compilación para Windows..."
  
  # Crear Dockerfile temporal para Windows
  cat > Dockerfile.win << EOF
FROM electronuserland/builder:wine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos del proyecto
COPY . .

# Instalar dependencias
RUN npm install

# Configurar para compilación de Windows
RUN npm config set msvs_version 2019

# Compilar para Windows
RUN npm run build -- --win --x64

# Mover el archivo compilado a un directorio conocido
RUN mkdir -p /output
RUN cp -r dist/*.exe /output/
EOF

  # Construir la imagen Docker para Windows
  docker build -t cordlang-builder-win -f Dockerfile.win . || { print_error "Error al construir la imagen Docker para Windows"; return 1; }
  
  # Ejecutar el contenedor y extraer el archivo compilado
  docker run --rm -v $(pwd)/build/win:/mnt cordlang-builder-win sh -c "cp /output/*.exe /mnt/installer.exe" || { print_error "Error al extraer el instalador de Windows"; return 1; }
  
  # Limpiar
  rm Dockerfile.win
  
  print_success "Compilación para Windows completada. Instalador disponible en build/win/installer.exe"
  return 0
}

# Compilación para macOS
build_macos() {
  print_message "Iniciando compilación para macOS..."
  
  # Verificar si estamos en un entorno macOS (necesario para firmar)
  if [[ "$(uname)" != "Darwin" ]]; then
    print_warning "No estás en macOS. La compilación se realizará sin firma de código."
  fi
  
  # Crear Dockerfile temporal para macOS
  cat > Dockerfile.mac << EOF
FROM electronuserland/builder:14

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos del proyecto
COPY . .

# Instalar dependencias
RUN npm install

# Compilar para macOS
RUN npm run build -- --mac --x64

# Mover el archivo compilado a un directorio conocido
RUN mkdir -p /output
RUN cp -r dist/*.dmg /output/
EOF

  # Construir la imagen Docker para macOS
  docker build -t cordlang-builder-mac -f Dockerfile.mac . || { print_error "Error al construir la imagen Docker para macOS"; return 1; }
  
  # Ejecutar el contenedor y extraer el archivo compilado
  docker run --rm -v $(pwd)/build/mac:/mnt cordlang-builder-mac sh -c "cp /output/*.dmg /mnt/installer.dmg" || { print_error "Error al extraer el instalador de macOS"; return 1; }
  
  # Limpiar
  rm Dockerfile.mac
  
  print_success "Compilación para macOS completada. Instalador disponible en build/mac/installer.dmg"
  return 0
}

# Compilación para Linux
build_linux() {
  print_message "Iniciando compilación para Linux..."
  
  # Crear Dockerfile temporal para Linux
  cat > Dockerfile.linux << EOF
FROM electronuserland/builder:14

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos del proyecto
COPY . .

# Instalar dependencias
RUN npm install

# Compilar para Linux
RUN npm run build -- --linux deb --x64

# Mover el archivo compilado a un directorio conocido
RUN mkdir -p /output
RUN cp -r dist/*.deb /output/
EOF

  # Construir la imagen Docker para Linux
  docker build -t cordlang-builder-linux -f Dockerfile.linux . || { print_error "Error al construir la imagen Docker para Linux"; return 1; }
  
  # Ejecutar el contenedor y extraer el archivo compilado
  docker run --rm -v $(pwd)/build/linux:/mnt cordlang-builder-linux sh -c "cp /output/*.deb /mnt/installer.deb" || { print_error "Error al extraer el instalador de Linux"; return 1; }
  
  # Limpiar
  rm Dockerfile.linux
  
  print_success "Compilación para Linux completada. Instalador disponible en build/linux/installer.deb"
  return 0
}

# Modificar package.json para asegurar que tenga los scripts correctos
update_package_json() {
  print_message "Actualizando package.json para compilación multiplataforma..."
  
  # Verificar si jq está instalado
  if ! command -v jq &> /dev/null; then
    print_warning "jq no está instalado. Instalando..."
    apt-get update && apt-get install -y jq || { print_error "No se pudo instalar jq. Por favor instálalo manualmente."; return 1; }
  fi
  
  # Hacer una copia de seguridad del package.json original
  cp package.json package.json.bak
  
  # Actualizar package.json con los scripts necesarios
  jq '.scripts.build = "electron-builder"' package.json > package.json.tmp && mv package.json.tmp package.json
  
  print_success "package.json actualizado correctamente."
  return 0
}

# Restaurar package.json original
restore_package_json() {
  if [ -f package.json.bak ]; then
    mv package.json.bak package.json
    print_message "package.json restaurado a su estado original."
  fi
}

# Registrar la función para restaurar package.json al salir
trap restore_package_json EXIT

# Ejecutar la compilación para todas las plataformas
main() {
  print_message "=== INICIANDO COMPILACIÓN MULTIPLATAFORMA DE CORDLANG INSTALLER ==="
  
  # Actualizar package.json
  update_package_json || { print_error "Error al actualizar package.json. Abortando."; exit 1; }
  
  # Compilar para cada plataforma
  build_windows
  win_status=$?
  
  build_macos
  mac_status=$?
  
  build_linux
  linux_status=$?
  
  # Mostrar resumen
  echo ""
  print_message "=== RESUMEN DE COMPILACIÓN ==="
  
  if [ $win_status -eq 0 ]; then
    print_success "Windows: Compilación exitosa - build/win/installer.exe"
  else
    print_error "Windows: Error en la compilación"
  fi
  
  if [ $mac_status -eq 0 ]; then
    print_success "macOS: Compilación exitosa - build/mac/installer.dmg"
  else
    print_error "macOS: Error en la compilación"
  fi
  
  if [ $linux_status -eq 0 ]; then
    print_success "Linux: Compilación exitosa - build/linux/installer.deb"
  else
    print_error "Linux: Error en la compilación"
  fi
  
  echo ""
  if [ $win_status -eq 0 ] && [ $mac_status -eq 0 ] && [ $linux_status -eq 0 ]; then
    print_success "¡Compilación multiplataforma completada con éxito!"
  else
    print_warning "Compilación completada con errores. Revisa los mensajes anteriores."
  fi
  
  print_message "Los instaladores están disponibles en la carpeta 'build/'."
}

# Ejecutar la función principal
main

exit 0
