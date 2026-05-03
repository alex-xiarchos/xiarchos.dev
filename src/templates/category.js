import React, { useMemo } from 'react'
import { graphql } from 'gatsby'

import { Layout } from '../components/Layout'
import { SiteHead } from '../components/SiteHead'
import { Posts } from '../components/Posts'
import { Hero } from '../components/Hero'
import { PageLayout } from '../components/PageLayout'
import { getSimplifiedPosts } from '../utils/helpers'

export default function CategoryTemplate({ data, pageContext }) {
  let { category } = pageContext
  const { totalCount } = data.allMarkdownRemark
  const posts = data.allMarkdownRemark.edges
  const simplifiedPosts = useMemo(() => getSimplifiedPosts(posts), [posts])
  const message =
    totalCount === 1 ? ' post categorized as:' : ' posts categorized as:'

  return (
    <PageLayout>
        <Hero
          highlight={totalCount}
          subTitle={message}
          title={category}
          type="taxonomy"
        />
        <Posts data={simplifiedPosts} showYears />
    </PageLayout>
  )
}

CategoryTemplate.Layout = Layout

export const Head = ({ pageContext }) => (
  <SiteHead title={pageContext.category} />
)

export const pageQuery = graphql`
  query CategoryPage($category: String) {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: { frontmatter: { categories: { in: [$category] } } }
    ) {
      totalCount
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            description
            tags
            categories
          }
        }
      }
    }
  }
`
