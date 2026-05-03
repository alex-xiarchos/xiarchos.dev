import React from 'react'

import { Layout } from '../components/Layout'
import { Hero } from '../components/Hero'
import { SiteHead } from '../components/SiteHead'
import { PageLayout } from '../components/PageLayout'

export default function PageTemplate({ pageContext }) {
  const post = pageContext.page
  const { title, thumbnail } = post.frontmatter

  return (
    <PageLayout>
        <Hero title={title} thumbnail={thumbnail} />
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
