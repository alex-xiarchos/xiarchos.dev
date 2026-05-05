import React from 'react'

export const WorkInProgressNotice = ({
  title = 'Not ready yet',
  children = 'This page is not ready yet. It will be written soon.',
}) => {
  return (
    <section className="work-in-progress-notice">
      <h2>{title}</h2>
      <p>{children}</p>
    </section>
  )
}
