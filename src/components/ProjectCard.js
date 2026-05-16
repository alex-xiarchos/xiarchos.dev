import React from 'react'
import { Link } from 'gatsby'

function getProjectSources(project) {
  if (project.sources) {
    return project.sources
  }

  return [
    {
      label: project.sourceLabel || 'Source',
      url: project.source || `https://github.com/alex-xiarchos/${project.slug}`,
    },
  ]
}

export function ProjectCard({ project }) {
  const sources = getProjectSources(project)

  return (
    <div className="card">
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
        {sources.map((source) => (
          <a
            className="button secondary small"
            href={source.url}
            target="_blank"
            rel="noreferrer"
            key={source.url}
          >
            {source.label}
          </a>
        ))}
      </div>
    </div>
  )
}
