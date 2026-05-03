import React from 'react'

import favicon from '../assets/nav-floppy.png'
import config from '../utils/config'
import { Seo } from './SEO'

export const SiteHead = ({
  title,
  description,
  postNode,
  postPath,
  postSEO,
}) => {
  const pageTitle = title ? `${title} | ${config.siteTitle}` : config.siteTitle

  return (
    <>
      <title>{pageTitle}</title>
      <link rel="shortcut icon" type="image/png" href={favicon} />
      <Seo
        customDescription={description}
        postNode={postNode}
        postPath={postPath}
        postSEO={postSEO}
      />
    </>
  )
}
