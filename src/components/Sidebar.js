import React from 'react'
import { Link } from 'gatsby'

import floppyLogo from '../assets/nav-floppy.png'
import floppy from '../assets/floppylogo.png'
import projects from '../assets/nav-projects.png'
import github from '../assets/nav-github.png'

export const Sidebar = () => {
  const links = [
    { url: '/projects', label: 'Projects', image: github },
    { url: '/experience', label: 'Experience', image: projects },
    { url: '/me', label: 'About Me', image: floppy },
  ]

  return (
    <aside className="sidebar">
      <section className="sidebar-section">
        <div className="sidebar-title-link">
          <Link to="/" className="sidebar-home-link">
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
      </section>

      <section className="sidebar-section">
        <h2>About Me</h2>
        <div className="sidebar-content">
          <p>
            I'm <Link to="/me">Alexandros</Link>, a web developer focused on
            practical web platforms, data systems, and clean interfaces.
          </p>
        </div>
      </section>

      <section className="sidebar-section">
        <nav className="sidebar-nav-links">
          {links.map((link) => (
            <Link key={link.url} to={link.url} activeClassName="active">
              <img src={link.image} alt={link.label} />
              {link.label}
            </Link>
          ))}
        </nav>
      </section>

      <section className="sidebar-section">
        <h2>Stay Connected</h2>
        <p className="sidebar-links">
          <a
            href="mailto:alex@xiarxos.gr"
            target="_blank"
            rel="noopener noreferrer"
          >
            Email
          </a>
          <a
            href="https://www.linkedin.com/in/alex-xiarchos/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/alex-xiarchos"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </p>
      </section>
    </aside>
  )
}
