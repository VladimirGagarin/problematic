import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiSearch, FiX } from 'react-icons/fi'
import SearchBar from './SearchBar'

function MobileSearch() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        className="icon-btn mobile-search-btn"
        aria-label="Search"
        title="Search"
        onClick={() => setOpen(true)}
      >
        <FiSearch size={19} />
      </button>

      {open &&
        createPortal(
          <div className="search-modal" role="dialog" aria-modal="true" aria-label="Search">
            <div className="search-modal-backdrop" onClick={() => setOpen(false)} />
            <div className="search-modal-panel">
              <SearchBar autoFocus onSubmitted={() => setOpen(false)} />
              <button
                type="button"
                className="search-modal-close"
                onClick={() => setOpen(false)}
                aria-label="Close search"
                title="Close"
              >
                <FiX size={20} />
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}

export default MobileSearch