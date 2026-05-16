import React from 'react'

import { Layout } from '../components/Layout'
import { SiteHead } from '../components/SiteHead'
import { Hero } from '../components/Hero'
import { PageLayout } from '../components/PageLayout'
import { ProjectCard } from '../components/ProjectCard'
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
          {projectsList.map((project) => (
            <ProjectCard project={project} key={project.slug} />
          ))}
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
