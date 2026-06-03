import React from 'react'

import { AppliedMlIrDemo } from './AppliedMlIrDemo'
import { GreekLatinBoldUnicodeConverterDemo } from './GreekLatinBoldUnicodeConverterDemo'

const projectDemos = {
  '/projects/applied-ml-ir-pipelines/': AppliedMlIrDemo,
  '/projects/greek-latin-bold-unicode-converter/':
    GreekLatinBoldUnicodeConverterDemo,
}

export function hasProjectDemo(slug) {
  return Boolean(projectDemos[slug])
}

export function ProjectDemo({ slug }) {
  const Demo = projectDemos[slug]

  return Demo ? <Demo standalone={false} /> : null
}
