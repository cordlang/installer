#!/bin/bash

# Script para compilar el instalador de cordlang usando Docker Compose
# Este script es una alternativa más sencilla que utiliza Docker Compose
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

# Verificar que Docker y Docker Compose estén instalados
if ! command -v docker &> /dev/null; then
  print_error "Docker no está instalado. Por favor, instala Docker antes de continuar."
  exit 1
fi

if ! command -v docker-compose &> /dev/null; then
  print_error "Docker Compose no está instalado. Por favor, instala Docker Compose antes de continuar."
  exit 1
fi

# Crear directorios de salida si no existen
mkdir -p build/win
mkdir -p build/mac
mkdir -p build/linux

print_message "Iniciando compilación multiplataforma para cordlang installer..."

# Crear archivo docker-compose.yml
cat > docker-compose.yml << EOF
version: '3'

services:
  windows-builder:
    image: electronuserland/builder:wine
    volumes:
      - .:/app
      - ./build/win:/output
    working_dir: /app
    command: >
      bash -c "npm install &&
              npm run build -- --win --x64 &&
              cp -r dist/*.exe /output/installer.exe"

  macos-builder:
    image: electronuserland/builder:14
    volumes:
      - .:/app
      - ./build/mac:/output
    working_dir: /app
    command: >
      bash -c "npm install &&
              npm run build -- --mac --x64 &&
              cp -r dist/*.dmg /output/installer.dmg"

  linux-builder:
    image: electronuserland/builder:14
    volumes:
      - .:/app
      - ./build/linux:/output
    working_dir: /app
    command: >
      bash -c "npm install &&
              npm run build -- --linux deb --x64 &&
              cp -r dist/*.deb /output/installer.deb"
EOF

# Modificar package.json para asegurar que tenga los scripts correctos
print_message "Actualizando package.json para compilación multiplataforma..."

# Hacer una copia de seguridad del package.json original
cp package.json package.json.bak

# Actualizar package.json con los scripts necesarios (usando sed en lugar de jq para mayor compatibilidad)
sed -i 's/"build": "electron-builder"/"build": "electron-builder"/g' package.json
if ! grep -q '"build": "electron-builder"' package.json; then
  # Si no existe el script build, lo añadimos
  sed -i 's/"scripts": {/"scripts": {\n    "build": "electron-builder",/g' package.json
fi

print_success "package.json actualizado correctamente."

# Compilar para todas las plataformas
print_message "=== INICIANDO COMPILACIÓN MULTIPLATAFORMA ==="

# Windows
print_message "Compilando para Windows..."
docker-compose up windows-builder
if [ -f "build/win/installer.exe" ]; then
  print_success "Compilación para Windows completada."
else
  print_error "Error en la compilación para Windows."
fi

# macOS
print_message "Compilando para macOS..."
docker-compose up macos-builder
if [ -f "build/mac/installer.dmg" ]; then
  print_success "Compilación para macOS completada."
else
  print_error "Error en la compilación para macOS."
fi

# Linux
print_message "Compilando para Linux..."
docker-compose up linux-builder
if [ -f "build/linux/installer.deb" ]; then
  print_success "Compilación para Linux completada."
else
  print_error "Error en la compilación para Linux."
fi

# Limpiar
print_message "Limpiando recursos temporales..."
docker-compose down
rm docker-compose.yml
mv package.json.bak package.json

# Mostrar resumen
echo ""
print_message "=== RESUMEN DE COMPILACIÓN ==="

if [ -f "build/win/installer.exe" ]; then
  print_success "Windows: Compilación exitosa - build/win/installer.exe"
else
  print_error "Windows: Error en la compilación"
fi

if [ -f "build/mac/installer.dmg" ]; then
  print_success "macOS: Compilación exitosa - build/mac/installer.dmg"
else
  print_error "macOS: Error en la compilación"
fi

if [ -f "build/linux/installer.deb" ]; then
  print_success "Linux: Compilación exitosa - build/linux/installer.deb"
else
  print_error "Linux: Error en la compilación"
fi

echo ""
if [ -f "build/win/installer.exe" ] && [ -f "build/mac/installer.dmg" ] && [ -f "build/linux/installer.deb" ]; then
  print_success "¡Compilación multiplataforma completada con éxito!"
else
  print_warning "Compilación completada con errores. Revisa los mensajes anteriores."
fi

print_message "Los instaladores están disponibles en la carpeta 'build/'."

exit 0
