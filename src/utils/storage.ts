import type { Draft } from '../types/Draft'

const STORAGE_KEY = 'wechat-draft-box:drafts'

export function loadDrafts(): Draft[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const rawDrafts = window.localStorage.getItem(STORAGE_KEY)
    if (!rawDrafts) {
      return []
    }

    const drafts = JSON.parse(rawDrafts) as Draft[]
    return Array.isArray(drafts)
      ? drafts
          .filter((draft) => draft && typeof draft.id === 'string')
          .map((draft) => ({
            ...draft,
            caption: draft.caption ?? '',
            images: Array.isArray(draft.images) ? draft.images.slice(0, 9) : [],
            createdAt: draft.createdAt ?? draft.updatedAt ?? Date.now(),
            updatedAt: draft.updatedAt ?? Date.now(),
          }))
      : []
  } catch {
    return []
  }
}

export function saveDrafts(drafts: Draft[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts))
}

export function clearDrafts() {
  window.localStorage.removeItem(STORAGE_KEY)
}
