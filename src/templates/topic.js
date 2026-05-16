import React, { useMemo } from 'react'
import { graphql } from 'gatsby'

import { Layout } from '../components/Layout'
import { SiteHead } from '../components/SiteHead'
import { Posts } from '../components/Posts'
import { Hero } from '../components/Hero'
import { PageLayout } from '../components/PageLayout'
import { getSimplifiedPosts } from '../utils/helpers'

export default function TopicTemplate({ data, pageContext }) {
  const { tag } = pageContext
  const { totalCount } = data.allMarkdownRemark
  const posts = data.allMarkdownRemark.edges
  const simplifiedPosts = useMemo(() => getSimplifiedPosts(posts), [posts])
  const message = totalCount === 1 ? ' post' : ' posts'

  return (
    <PageLayout>
        <Hero
          highlight={totalCount}
          subTitle={message}
          title={tag}
          type="taxonomy"
          breadcrumb={{ value: '/topics', label: 'Topics' }}
        />
        <Posts data={simplifiedPosts} showYears />
    </PageLayout>
  )
}

TopicTemplate.Layout = Layout

export const Head = ({ pageContext }) => <SiteHead title={pageContext.tag} />

export const pageQuery = graphql`
  query TopicPage($tag: String) {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            tags
          }
        }
      }
    }
  }
`
