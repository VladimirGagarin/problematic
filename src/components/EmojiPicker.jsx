import { useEffect, useMemo, useRef, useState } from 'react'
import { FiX } from 'react-icons/fi'
import { defaultFrequent, emojiGroups } from '../data/emojis'
import './EmojiPicker.css'

const STORAGE_KEY = 'problematic:emoji-usage'

function readUsage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

function EmojiPicker({ open, onPick, onClose }) {
  const [usage, setUsage] = useState(readUsage)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const handlePointer = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) onClose()
    }
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open, onClose])

  const frequent = useMemo(() => {
    const ranked = Object.entries(usage)
      .sort((a, b) => b[1] - a[1])
      .map(([emoji]) => emoji)
    const extra = defaultFrequent.filter((emoji) => !ranked.includes(emoji))
    return [...ranked, ...extra].slice(0, 12)
  }, [usage])

  if (!open) return null

  const handlePick = (emoji) => {
    const next = { ...usage, [emoji]: (usage[emoji] || 0) + 1 }
    setUsage(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      onPick(emoji)
      return
    }
    onPick(emoji)
  }

  return (
    <div className="emoji-picker" ref={rootRef} role="dialog" aria-label="Choose an emoji">
      <div className="emoji-picker-head">
        <span className="emoji-picker-title">emoji</span>
        <button
          type="button"
          className="emoji-picker-close"
          onClick={onClose}
          aria-label="Close emoji picker"
          title="Close"
        >
          <FiX size={14} />
        </button>
      </div>

      <div className="emoji-picker-body">
        <div className="emoji-section">
          <span className="emoji-section-label">frequently used</span>
          <div className="emoji-grid">
            {frequent.map((emoji) => (
              <button
                key={`freq-${emoji}`}
                type="button"
                className="emoji-btn"
                onClick={() => handlePick(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {emojiGroups.map((group) => (
          <div className="emoji-section" key={group.name}>
            <span className="emoji-section-label">{group.name.toLowerCase()}</span>
            <div className="emoji-grid">
              {group.emojis.map((emoji) => (
                <button
                  key={`${group.name}-${emoji}`}
                  type="button"
                  className="emoji-btn"
                  onClick={() => handlePick(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EmojiPicker
