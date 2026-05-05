import React from 'react'
import { Link } from 'gatsby'

import { Layout } from '../components/Layout'
import { SiteHead } from '../components/SiteHead'
import { Heading } from '../components/Heading'
import { Hero } from '../components/Hero'
import { PageLayout } from '../components/PageLayout'
import { experienceList } from '../data/experienceList'
import { projectsList } from '../data/projectsList'
import floppy from '../assets/floppylogo.png'
import projects from '../assets/nav-projects.png'
import github from '../assets/nav-github.png'

export default function Index() {
  return (
    <PageLayout>
        <Hero type="index">
          <div className="hero-wrapper">
            <div>
              <h1>Hey, I'm Alexandros!</h1>
              <p className="hero-description">
                I'm a software developer exploring ideas, systems, and useful
                digital work.
              </p>
              <p className="hero-description">
                This space is still taking shape, and the final version will
                come together over time.
              </p>
              <p
                className="flex-wrap flex-align-center gap"
                style={{ marginBottom: 0 }}
              >
                <Link className="button" to="/me">
                  <img src={floppy} alt="Floppy Logo" /> About Me
                </Link>
                <Link className="button" to="/experience">
                  <img src={projects} alt="Projects Logo" /> Experience
                </Link>
                <Link className="button" to="/projects">
                  <img src={github} alt="Projects Logo" /> Projects
                </Link>
              </p>
            </div>
            <div className="hero-image-container">
              <img src="/hero.png" className="hero-image" alt="Alexandros" />
            </div>
          </div>
        </Hero>

        <section className="section-index">
          <Heading
            title="Experience"
            slug="/experience"
            buttonText="All Experience"
            description="Web development and teaching assistant experience."
            icon={projects}
          />
          <div className="cards">
            {experienceList.map((experience) => {
              return (
                <div
                  className="card"
                  key={`experience-${experience.company}-${experience.title}`}
                >
                  <time>{experience.date}</time>
                  <h2 className="card-title">{experience.title}</h2>
                  <p className="card-company">{experience.company}</p>
                  <p>{experience.summary}</p>
                </div>
              )
            })}
          </div>
        </section>

        <section>
          <Heading
            title="Projects"
            slug="/projects"
            buttonText="All Projects"
            description="Web, data, information retrieval, and low-code projects."
            icon={github}
          />

          <div className="cards">
            {projectsList
              .filter((project) => project.highlight)
              .map((project) => {
                return (
                  <div className="card" key={`hightlight-${project.slug}`}>
                    <time>{project.date}</time>
                    <Link to={project.writeup || '/projects'}>
                      {project.name}
                    </Link>
                    <p>{project.tagline}</p>
                    <div className="card-links">
                      <a
                        className="button secondary small"
                        href={project.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {project.urlLabel || 'Demo'}
                      </a>
                      <a
                        className="button secondary small"
                        href={
                          project.source ||
                          `https://github.com/alex-xiarchos/${project.slug}`
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        Source
                      </a>
                    </div>
                  </div>
                )
              })}
          </div>
        </section>
    </PageLayout>
  )
}

Index.Layout = Layout

export const Head = () => <SiteHead />
