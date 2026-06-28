import { useLanguage } from '../context/LanguageContext';
import type { Draft } from '../types/Draft'
import { ImageGrid } from './ImageGrid'

interface DraftCardProps {
  draft: Draft;
  onOpen: () => void;
}

function getCaptionPreview(caption: string, language: string) {
  const cleanCaption = caption.trim()

  return cleanCaption || (language === 'zh' ? '未命名草稿' : 'Untitled Draft')
}

function formatUpdatedAt(updatedAt: number, language: string) {
  const formatter = new Intl.RelativeTimeFormat(language, {numeric: 'auto',})
  const diff = updatedAt - Date.now()
  const minutes = Math.round(diff / 60000)
  const hours = Math.round(minutes / 60)
  const days = Math.round(hours / 24)

  if (Math.abs(minutes) < 60) {
    return formatter.format(minutes, "minute")
  }

  if (Math.abs(hours) < 24) {
    return formatter.format(hours, "hour")
  }

  if (Math.abs(days) < 7) {
    return formatter.format(days, "day")
  }

  return new Intl.DateTimeFormat(language, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(updatedAt)
}

export function DraftCard({ draft, onOpen }: DraftCardProps) {
  const { t, language } = useLanguage();

  return (
    <button
      className={`draft-card ${draft.images.length === 0 ? 'without-images' : ''}`}
      type="button"
      onClick={onOpen}
    >
      {draft.images.length > 0 ? <ImageGrid images={draft.images} mode="preview" /> : null}
      <span className="draft-caption">{getCaptionPreview(draft.caption, language)}</span>
      <span className="draft-meta">
        {draft.images.length} {draft.images.length === 1 ? t.image : t.images} -{' '}
        {formatUpdatedAt(draft.updatedAt, language)}
      </span>
    </button>
  )
}
