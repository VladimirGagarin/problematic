import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'

function SearchBar({ className = '', autoFocus = false, placeholder = 'Search problems, ideas and topics…' }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/discoveries?q=${encodeURIComponent(q)}` : '/discoveries')
  }

  return (
    <form className={`search-bar ${className}`.trim()} role="search" onSubmit={handleSubmit}>
      <FiSearch className="search-bar-icon" size={17} />
      <input
        className="search-bar-input"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
        autoFocus={autoFocus}
      />
    </form>
  )
}

export default SearchBar