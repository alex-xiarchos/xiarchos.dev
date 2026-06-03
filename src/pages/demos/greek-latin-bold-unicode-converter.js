import React from 'react'

import { GreekLatinBoldUnicodeConverterDemo } from '../../components/GreekLatinBoldUnicodeConverterDemo'

export default function GreekLatinBoldUnicodeConverter() {
  return <GreekLatinBoldUnicodeConverterDemo />
}

export const Head = () => (
  <>
    <html lang="el" />
    <title>Greek & Latin Bold Unicode Converter</title>
    <meta
      name="description"
      content="Convert Greek, Latin, and numeric text into bold mathematical Unicode characters."
    />
  </>
)
