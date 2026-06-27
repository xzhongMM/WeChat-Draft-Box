import type { Draft } from '../types/Draft'
import { ImageGrid } from './ImageGrid'

interface DraftCardProps {
  draft: Draft;
  onOpen: () => void;
}

function getCaptionPreview(caption: string) {
  const cleanCaption = caption.trim()
  return cleanCaption || 'Untitled Draft'
}

function formatUpdatedAt(updatedAt: number) {
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
  const diff = updatedAt - Date.now()
  const minutes = Math.round(diff / 60000)
  const hours = Math.round(minutes / 60)
  const days = Math.round(hours / 24)

  if (Math.abs(minutes) < 60) {
    return formatter.format(minutes, 'minute')
  }

  if (Math.abs(hours) < 24) {
    return formatter.format(hours, 'hour')
  }

  if (Math.abs(days) < 7) {
    return formatter.format(days, 'day')
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(updatedAt)
}

export function DraftCard({ draft, onOpen }: DraftCardProps) {
  return (
    <button
      className={`draft-card ${draft.images.length === 0 ? 'without-images' : ''}`}
      type="button"
      onClick={onOpen}
    >
      {draft.images.length > 0 ? <ImageGrid images={draft.images} mode="preview" /> : null}
      <span className="draft-caption">{getCaptionPreview(draft.caption)}</span>
      <span className="draft-meta">
        {draft.images.length} {draft.images.length === 1 ? 'image' : 'images'} -{' '}
        {formatUpdatedAt(draft.updatedAt)}
      </span>
    </button>
  )
}
