import React from 'react'

import { Layout } from '../components/Layout'
import { SiteHead } from '../components/SiteHead'
import { Hero } from '../components/Hero'
import { PageLayout } from '../components/PageLayout'
import { experienceList } from '../data/experienceList'
import projects from '../assets/nav-projects.png'

export default function Experience() {
  const title = 'Experience'
  const description =
    'Professional and teaching experience across web development, electronics labs, support, and practical software work.'

  return (
    <PageLayout>
      <Hero title={title} description={description} icon={projects} />

      <div className="cards">
        {experienceList.map((experience) => (
          <div
            className="card"
            key={`${experience.company}-${experience.title}`}
          >
            <time>{experience.date}</time>
            <h2 className="card-title">{experience.title}</h2>
            <p className="card-company">{experience.company}</p>
            <p>{experience.summary}</p>
            <ul className="card-list">
              {experience.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </PageLayout>
  )
}

Experience.Layout = Layout

export const Head = () => (
  <SiteHead
    title="Experience"
    description="Professional and teaching experience across web development, electronics labs, support, and practical software work."
  />
)
