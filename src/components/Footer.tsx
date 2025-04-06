"use client"

import type React from "react"

const Footer: React.FC = () => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault()
    if (window.electronAPI) {
      // Si estamos en Electron, usar la API para abrir en navegador externo
      window.electronAPI.openExternalLink(url)
    } else {
      // Fallback para desarrollo o entornos no-Electron
      window.open(url, "_blank")
    }
  }

  return (
    <footer className="py-3 px-4 text-center text-light-tertiary text-xs bg-dark-primary border-t border-dark-tertiary z-10 flex items-center justify-center">
      <div className="flex items-center space-x-4">
        <span>&copy; {new Date().getFullYear()} cordlang</span>
        <a
          href="https://docs.cordlang.com"
          onClick={(e) => handleLinkClick(e, "https://docs.cordlang.com")}
          className="hover:text-accent-primary transition-colors cursor-pointer"
        >
          Documentación
        </a>
        <a
          href="https://github.com/cordlang/CordLang"
          onClick={(e) => handleLinkClick(e, "https://github.com/cordlang/CordLang")}
          className="hover:text-accent-primary transition-colors cursor-pointer"
        >
          GitHub
        </a>
        <a
          href="https://discord.com/invite/c4q85TkKnf"
          onClick={(e) => handleLinkClick(e, "https://discord.com/invite/c4q85TkKnf")}
          className="hover:text-accent-primary transition-colors cursor-pointer"
        >
          Discord
        </a>
      </div>
    </footer>
  )
}

export default Footer

