import React from 'react'

import { Layout } from '../components/Layout'
import { PageLayout } from '../components/PageLayout'
import { SiteHead } from '../components/SiteHead'
import { Hero } from '../components/Hero'

export default function FourOhFour() {
  return (
    <PageLayout>
      <Hero title="404" description="Not found." />
    </PageLayout>
  )
}

FourOhFour.Layout = Layout

export const Head = () => <SiteHead title="404" />
