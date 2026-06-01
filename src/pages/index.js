import React from 'react'
import { Link } from 'gatsby'

import { Layout } from '../components/Layout'
import { SiteHead } from '../components/SiteHead'
import { Heading } from '../components/Heading'
import { Hero } from '../components/Hero'
import { PageLayout } from '../components/PageLayout'
import { ProjectCard } from '../components/ProjectCard'
import { experienceList } from '../data/experienceList'
import { projectsList } from '../data/projectsList'
import floppy from '../assets/floppylogo.png'
import projects from '../assets/nav-projects.png'
import github from '../assets/nav-github.png'

const floppySrc = String(floppy)
const projectsSrc = String(projects)
const githubSrc = String(github)

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
                  <img src={floppySrc} alt="Floppy Logo" /> About Me
                </Link>
                <Link className="button" to="/experience">
                  <img src={projectsSrc} alt="Projects Logo" /> Experience
                </Link>
                <Link className="button" to="/projects">
                  <img src={githubSrc} alt="Projects Logo" /> Projects
                </Link>
              </p>
              <section className="callout-card cv-callout" aria-labelledby="cv-title">
                <div>
                  <h2 id="cv-title">Curriculum Vitae</h2>
                  <p>Latest PDF resume</p>
                </div>
                <a
                  className="button secondary small"
                  href="/Alexandros_Xiarchos_CV.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open PDF
                </a>
              </section>
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
            icon={projectsSrc}
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
            icon={githubSrc}
          />

          <div className="cards">
            {projectsList
              .filter((project) => project.highlight)
              .map((project) => (
                <ProjectCard project={project} key={`highlight-${project.slug}`} />
              ))}
          </div>
        </section>
    </PageLayout>
  )
}

Index.Layout = Layout

export const Head = () => <SiteHead />
