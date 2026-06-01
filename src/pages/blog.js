import React, { useMemo } from 'react'
import { Link, graphql } from 'gatsby'

import { Hero } from '../components/Hero'
import { Layout } from '../components/Layout'
import { Search } from '../components/Search'
import { SiteHead } from '../components/SiteHead'
import { PageLayout } from '../components/PageLayout'
import { getSimplifiedPosts } from '../utils/helpers'
import blogIcon from '../assets/nav-blog.png'

export default function Blog({ data }) {
  const posts = data.posts.edges
  const simplifiedPosts = useMemo(() => getSimplifiedPosts(posts), [posts])
  const title = 'Blog'
  const descriptionText =
    'Articles, references, and tutorials on programming, web development, design, and projects.'

  const description = (
    <div>
      {descriptionText}{' '}
      <Link to="/topics">View all topics.</Link>
    </div>
  )

  return (
    <PageLayout>
      <Hero title={title} description={description} hasSearch icon={blogIcon} />

      <Search data={simplifiedPosts} section="blog" />
    </PageLayout>
  )
}

Blog.Layout = Layout

export const Head = () => (
  <SiteHead
    title="Blog"
    description="Articles, references, and tutorials on programming, web development, design, and projects."
  />
)

export const articlesQuery = graphql`
  query BlogQuery {
    posts: allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: { frontmatter: { template: { eq: "post" } } }
    ) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
          }
        }
      }
    }
  }
`
