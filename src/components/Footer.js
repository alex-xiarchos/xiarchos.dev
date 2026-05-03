import React from 'react'
import { SocialIcon } from 'react-social-icons'

const links = [
  { url: 'mailto:alex@xiarxos.gr', label: 'Email' },
  {
    url: 'https://www.linkedin.com/in/alex-xiarchos/',
    label: 'LinkedIn',
  },
  { url: 'https://github.com/alex-xiarchos', label: 'GitHub' },
]

export const Footer = () => {
  return (
    <footer className="footer">
      <section className="footer-section">
        <nav className="footer-menu-buttons">
          {links.map((link) => (
            <a
              href={link.url}
              title={link.label}
              target="_blank"
              rel="noopener noreferrer"
              key={link.url}
              className="button small"
            >
              <SocialIcon
                url={link.url}
                fgColor="currentColor"
                bgColor="transparent"
                className="footer-button-icon"
              />
              <span>{link.label}</span>
            </a>
          ))}
        </nav>
        <div className="footer-made-by">Made with ❤️ by Alexandros Xiarchos</div>
      </section>
    </footer>
  )
}
