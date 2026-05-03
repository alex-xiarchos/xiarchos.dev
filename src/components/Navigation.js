import React, { useState } from 'react'
import { Link } from 'gatsby'
import { SocialIcon } from 'react-social-icons'

import floppy from '../assets/floppylogo.png'
import floppyLogo from '../assets/nav-floppy.png'
import projects from '../assets/nav-projects.png'
import github from '../assets/nav-github.png'
import { Menu } from '../assets/Menu'
import { Close } from '../assets/Close'

const links = [
  { url: '/projects', label: 'Projects', image: github },
  { url: '/experience', label: 'Experience', image: projects },
  { url: '/me', label: 'About Me', image: floppy },
]

const socialLinks = [
  { url: 'https://github.com/alex-xiarchos' },
  { url: 'https://www.linkedin.com/in/alex-xiarchos/' },
  { url: 'mailto:alex@xiarxos.gr' },
]

export const Navigation = () => {
  const [navOpen, setNavOpen] = useState(false)

  const handleToggleMobileNav = () => {
    setNavOpen((prev) => !prev)
  }

  const handleCloseMobileNav = () => {
    setNavOpen(false)
  }

  return (
    <header className="navbar">
      <div className="navbar-title">
        <div className="navbar-title-content">
          <Link to="/" className="navbar-title-link">
            <span>
              <img
                src={floppyLogo}
                className="navbar-logo"
                alt="xiarxos.gr"
                title="💾"
                height="16"
                width="16"
              />
            </span>
            <span className="site-name">Alexandros Xiarchos</span>
          </Link>
        </div>
      </div>
      <div className="navbar-container">
        <section className="navbar-section navbar-section-search" />
        <section className="navbar-section">
          <button
            className={`navbar-button nav-menu-button ${
              navOpen ? 'active' : ''
            }`}
            onClick={handleToggleMobileNav}
          >
            {navOpen ? <Close /> : <Menu />}
          </button>
          <nav className={`navbar-menu nav-items ${navOpen ? 'active' : ''}`}>
            {links.map((link) => (
              <Link
                key={link.url}
                to={link.url}
                activeClassName="active"
                onClick={handleCloseMobileNav}
              >
                <img src={link.image} alt={link.label} />
                {link.label}
              </Link>
            ))}
          </nav>
          <nav className="navbar-menu social">
            {socialLinks.map((link) => (
              <SocialIcon
                target="_blank"
                key={link.url}
                url={link.url}
                fgColor="currentColor"
                bgColor="transparent"
                className="navbar-icon"
              />
            ))}
          </nav>
        </section>
      </div>
    </header>
  )
}
