import React from 'react'

import { ColorDropdown } from './ColorDropdown'
import { Moon } from '../assets/Moon'
import { Sun } from '../assets/Sun'

export const AppearanceControls = ({
  theme,
  handleUpdateTheme,
  currentColor,
  setCurrentColor,
}) => {
  return (
    <div className="appearance-controls" aria-label="Appearance controls">
      <ColorDropdown
        currentColor={currentColor}
        setCurrentColor={setCurrentColor}
      />
      <div className="tooltip-container">
        <button
          className="navbar-button"
          onClick={() => {
            const newTheme = theme === 'dark' ? 'light' : 'dark'

            handleUpdateTheme(newTheme)
          }}
        >
          {theme === 'dark' ? <Sun /> : <Moon />}
        </button>
        <div className="tooltip">Theme</div>
      </div>
    </div>
  )
}
