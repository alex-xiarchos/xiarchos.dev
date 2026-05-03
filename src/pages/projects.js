import React, { useState, useEffect } from 'react'
import { Link } from 'gatsby'

import { StarIcon } from '../assets/StarIcon'
import { Layout } from '../components/Layout'
import { SiteHead } from '../components/SiteHead'
import { Hero } from '../components/Hero'
import { PageLayout } from '../components/PageLayout'
import { projectsList } from '../data/projectsList'
import github from '../assets/nav-github.png'

export default function Projects() {
  const [repos, setRepos] = useState([])
  const title = 'Projects'
  const description =
    'Selected web, data mining, information retrieval, data structures, and low-code projects.'

  useEffect(() => {
    async function getStars() {
      const repos = await fetch(
        'https://api.github.com/users/alex-xiarchos/repos?per_page=100'
      )

      return repos.json()
    }

    getStars()
      .then((data) => {
        setRepos(data)
      })
      .catch((err) => console.error(err))
  }, [])

  return (
    <PageLayout>
        <Hero title={title} description={description} icon={github} />

        <div className="cards">
          {projectsList.map((project) => {
            const source = project.source || `https://github.com/alex-xiarchos/${project.slug}`
            const repoName = project.repo || project.slug
            const repo = repos.find((repo) => repo.name === repoName)

            return (
              <div className="card" key={project.slug}>
                <div className="stars">
                  {repo && (
                    <div className="star">
                      <a href={`${repo.html_url}/stargazers`}>
                        {Number(repo.stargazers_count).toLocaleString()}
                      </a>
                      <StarIcon />
                    </div>
                  )}
                </div>
                <time>{project.date}</time>
                <a
                  className="card-header"
                  href={source}
                  target="_blank"
                  rel="noreferrer"
                >
                  {project.name}
                </a>
                <p>{project.tagline}</p>
                <div className="card-links">
                  {project.writeup && (
                    <Link
                      className="button secondary small"
                      to={project.writeup}
                    >
                      Article
                    </Link>
                  )}
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
