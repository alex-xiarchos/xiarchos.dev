import React from 'react'

import { Layout } from '../components/Layout'
import { Hero } from '../components/Hero'
import { SiteHead } from '../components/SiteHead'
import { PageLayout } from '../components/PageLayout'
import { WorkInProgressNotice } from '../components/WorkInProgressNotice'
import { AppliedMlIrDemo } from '../components/AppliedMlIrDemo'
import floppy from '../assets/nav-floppy.png'
import projects from '../assets/nav-projects.png'

const pageIcons = {
  '/experience/': projects,
  '/me/': floppy,
}

const unfinishedPages = new Set(['/experience/', '/me/'])

export default function PageTemplate({ pageContext }) {
  const post = pageContext.page
  const { title, description, thumbnail } = post.frontmatter
  const icon = pageIcons[post.fields.slug]
  const isUnfinishedPage = unfinishedPages.has(post.fields.slug)
  const hasAppliedMlIrDemo = post.fields.slug === '/projects/applied-ml-ir-pipelines/'
  const heroDescription =
    isUnfinishedPage || hasAppliedMlIrDemo ? null : description

  return (
    <PageLayout>
        <Hero
          title={title}
          description={heroDescription}
          icon={icon}
          thumbnail={thumbnail}
        />
        {isUnfinishedPage ? (
          <WorkInProgressNotice>
            This page is not ready yet. It will be written next.
          </WorkInProgressNotice>
        ) : (
          <>
            {hasAppliedMlIrDemo && <AppliedMlIrDemo />}
            <div
              className="page-article"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          </>
        )}
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
