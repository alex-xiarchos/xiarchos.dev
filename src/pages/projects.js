import React from 'react'
import { Link } from 'gatsby'

import { Layout } from '../components/Layout'
import { SiteHead } from '../components/SiteHead'
import { Hero } from '../components/Hero'
import { PageLayout } from '../components/PageLayout'
import { projectsList } from '../data/projectsList'
import github from '../assets/nav-github.png'

export default function Projects() {
  const title = 'Projects'
  const description =
    'Selected web, data mining, information retrieval, data structures, and low-code projects.'

  return (
    <PageLayout>
        <Hero title={title} description={description} icon={github} />

        <div className="cards">
          {projectsList.map((project) => {
            const source = project.source || `https://github.com/alex-xiarchos/${project.slug}`

            return (
              <div className="card" key={project.slug}>
                <time>{project.date}</time>
                <Link className="card-header" to={project.writeup || '/projects'}>
                  {project.name}
                </Link>
                <p>{project.tagline}</p>
                <div className="card-links">
                  {project.url && (
                    <a
                      className="button secondary small"
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {project.urlLabel || 'Demo'}
                    </a>
                  )}
                  <a
                    className="button secondary small"
                    href={source}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {project.sourceLabel || 'Source'}
                  </a>
                </div>
              </div>
            )
          })}
        </div>
    </PageLayout>
  )
}

Projects.Layout = Layout

export const Head = () => (
  <SiteHead
    title="Projects"
    description="Selected web, data mining, information retrieval, data structures, and low-code projects."
  />
)
