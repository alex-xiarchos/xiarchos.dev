import React, { useRef } from 'react'
import { navigate } from 'gatsby'

import searchIcon from '../assets/nav-search.png'

export const Searchbar = ({
  count,
  query,
  handleSearch,
  setQuery,
  isLocal = true,
  ...props
}) => {
  const searchRef = useRef(null)

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()

        if (!isLocal) {
          const updatedValue = query ? `/blog?search=${query}` : ''
          setQuery('')
          navigate(updatedValue)
        }
      }}
    >
      <div
        className={`search-container ${!isLocal ? 'with-button' : ''}`}
        {...props}
      >
        <input
          ref={searchRef}
          id="search"
          type="search"
          className={`searchbar ${isLocal ? 'with-icon' : ''}`}
          placeholder={
            isLocal ? `Search ${count} posts...` : 'Search posts...'
          }
          value={query}
          autoComplete="off"
          onChange={handleSearch}
        />
        {isLocal && (
          <button
            type="button"
            className="search-icon"
            aria-label="Focus search"
            onClick={() => searchRef.current.focus()}
          >
            <img src={searchIcon} alt="" />
          </button>
        )}
        {!isLocal && (
          <button
            type="submit"
            className="transparent-button"
            disabled={!query}
          >
            Go
          </button>
        )}
      </div>
    </form>
  )
}
