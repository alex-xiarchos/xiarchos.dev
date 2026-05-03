import React from 'react'
import { Link, graphql } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'

import { Layout } from '../components/Layout'
import { SiteHead } from '../components/SiteHead'
import { PostLayout } from '../components/PostLayout'
import { Comments } from '../components/Comments'
import { Hero } from '../components/Hero'
import { slugify } from '../utils/helpers'

export default function PostTemplate({ data }) {
  const post = data.markdownRemark
  const { title, date, comments_off, thumbnail, tags } = post.frontmatter
  const isNote = post.frontmatter.categories?.includes('Personal')

  return (
    <PostLayout post={post} isNote={isNote}>
        {thumbnail && (
          <GatsbyImage
            image={thumbnail?.childImageSharp?.gatsbyImageData}
            className="main-article-thumbnail"
            alt="Thumbnail"
          />
        )}
        <Hero
          title={title}
          type="post"
          date={
            <div className="small flex-align-center gap">
              <span>{date}</span>
              <div className="divider" />
              <a href="#comments">Comments</a>
            </div>
          }
        >
          <div className="tags">
            {tags.map((tag) => {
              return (
                <Link
                  key={tag}
                  to={`/topics/${slugify(tag)}`}
                  className="button secondary small"
                  activeClassName="active"
                >
                  {tag}
                </Link>
              )
            })}
          </div>
        </Hero>

        <div
          className="main-article"
          id={post.fields.slug}
          dangerouslySetInnerHTML={{
            __html: `<div class="introduction" id="introduction"></div>${post.html}`,
          }}
        />
        {!comments_off && (
          <section id="comments" className="comments">
            <h3>Comments</h3>
            <Comments />
          </section>
        )}
    </PostLayout>
  )
}

PostTemplate.Layout = Layout

export const Head = ({ data }) => {
  const post = data.markdownRemark

  return (
    <SiteHead
      title={post.frontmatter.title}
      postPath={post.fields.slug}
      postNode={post}
      postSEO
    />
  )
}

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      excerpt
      tableOfContents(maxDepth: 3)
      fields {
        slug
      }
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        tags
        categories
        description
        comments_off
        thumbnail {
          childImageSharp {
            gatsbyImageData(width: 75, height: 75, layout: FIXED)
          }
        }
      }
    }
  }
`
