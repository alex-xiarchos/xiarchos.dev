import React from 'react'

import { Layout } from '../components/Layout'
import { Hero } from '../components/Hero'
import { SiteHead } from '../components/SiteHead'
import { PageLayout } from '../components/PageLayout'
import floppy from '../assets/nav-floppy.png'
import projects from '../assets/nav-projects.png'

const pageIcons = {
  '/experience/': projects,
  '/me/': floppy,
}

export default function PageTemplate({ pageContext }) {
  const post = pageContext.page
  const { title, description, thumbnail } = post.frontmatter
  const icon = pageIcons[post.fields.slug]
  const heroDescription = post.fields.slug === '/me/' ? null : description

  return (
    <PageLayout>
        <Hero
          title={title}
          description={heroDescription}
          icon={icon}
          thumbnail={thumbnail}
        />
        <div
          className="page-article"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
    </PageLayout>
  )
}

PageTemplate.Layout = Layout

export const Head = ({ pageContext }) => (
  <SiteHead
    title={pageContext.page.frontmatter.title}
    description={pageContext.page.frontmatter.description}
  />
)
