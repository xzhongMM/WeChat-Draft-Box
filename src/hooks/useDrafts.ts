import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Draft } from '../types/Draft'
import { loadDrafts, saveDrafts } from '../utils/storage'

function createId() {
  return `draft-${Date.now()}-${crypto.randomUUID?.() ?? Math.random().toString(16).slice(2)}`
}

function createBlankDraft(): Draft {
  const now = Date.now()

  return {
    id: createId(),
    caption: '',
    images: [],
    createdAt: now,
    updatedAt: now,
  }
}

export function useDrafts() {
  const [drafts, setDrafts] = useState<Draft[]>(() => loadDrafts())

  useEffect(() => {
    saveDrafts(drafts)
  }, [drafts])

  const sortedDrafts = useMemo(
    () => [...drafts].sort((a, b) => b.updatedAt - a.updatedAt),
    [drafts],
  )

  const getAllDrafts = useCallback(() => sortedDrafts, [sortedDrafts])

  const getDraft = useCallback(
    (id: string) => drafts.find((draft) => draft.id === id),
    [drafts],
  )

  const createDraft = useCallback(() => {
    const draft = createBlankDraft()
    setDrafts((currentDrafts) => [draft, ...currentDrafts])
    return draft
  }, [])

  const saveDraft = useCallback((draft: Draft) => {
    const draftToSave = {
      ...draft,
      caption: draft.caption.trimStart(),
      images: draft.images.slice(0, 9),
      updatedAt: Date.now(),
    }

    setDrafts((currentDrafts) => {
      const exists = currentDrafts.some((currentDraft) => currentDraft.id === draftToSave.id)
      return exists
        ? currentDrafts.map((currentDraft) =>
            currentDraft.id === draftToSave.id ? draftToSave : currentDraft,
          )
        : [draftToSave, ...currentDrafts]
    })

    return draftToSave
  }, [])

  const deleteDraft = useCallback((id: string) => {
    setDrafts((currentDrafts) => currentDrafts.filter((draft) => draft.id !== id))
  }, [])

  return {
    drafts: sortedDrafts,
    getAllDrafts,
    getDraft,
    createDraft,
    saveDraft,
    deleteDraft,
  }
}
