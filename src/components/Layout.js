import React, { useState, useEffect } from 'react'

import { Navigation } from './Navigation'
import { Footer } from './Footer'
import { Sidebar } from './Sidebar'
import { AppearanceControls } from './AppearanceControls'

import '../styles/style.css'
import '../styles/new-moon.css'

const applyTheme = (newTheme) => {
  const html = document.documentElement
  const themeClass = `is-${newTheme}`

  document.documentElement.style.setProperty('color-scheme', newTheme)
  html.classList.remove('is-light', 'is-dark')
  html.classList.add(themeClass)
}

export const Layout = ({ data, children }) => {
  const [theme, setTheme] = useState('dark')
  const [currentColor, setCurrentColor] = useState('var(--theme-blue)')

  const handleUpdateTheme = (newTheme) => {
    window.localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
    setTheme(newTheme)
    window.dispatchEvent(
      new CustomEvent('themechange', { detail: { theme: newTheme } })
    )
  }

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('theme')

    if (savedTheme) {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    }
  }, [])

  return (
    <div>
      <div id="layout" className="layout">
        <AppearanceControls
          handleUpdateTheme={handleUpdateTheme}
          theme={theme}
          currentColor={currentColor}
          setCurrentColor={setCurrentColor}
        />
        <Navigation />
        <Sidebar />
        <div className="main-wrapper">
          <div className="main-container">{children}</div>
          <Footer />
        </div>
      </div>
    </div>
  )
}
