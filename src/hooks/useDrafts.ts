import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Draft } from '../types/Draft'
import { getDrafts, createDraft as apiCreateDraft, updateDraft as apiUpdateDraft, removeDraft } from "../utils/api";

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
  const [drafts, setDrafts] = useState<Draft[]>([]);

  useEffect(() => {
    async function loadServerDrafts() {
        const serverDrafts = await getDrafts();
        setDrafts(serverDrafts);
    }

    loadServerDrafts();
  }, []);

  const sortedDrafts = useMemo(
    () => [...drafts].sort((a, b) => b.updatedAt - a.updatedAt),
    [drafts],
  )

  const getAllDrafts = useCallback(() => sortedDrafts, [sortedDrafts])

  const getDraft = useCallback(
    (id: string) => drafts.find((draft) => draft.id === id),
    [drafts],
  )

  const createDraft = useCallback(async () => {
    const draft = createBlankDraft();

    await apiCreateDraft(draft);

    setDrafts((current) => [
        draft,
        ...current
    ]);

    return draft;
  }, []);

  const saveDraft = useCallback(async (draft: Draft) => {
    const savedDraft = await apiUpdateDraft(draft);

    setDrafts((current) =>
      current.map((item) =>
        item.id === savedDraft.id
          ? savedDraft
          : item
        )
    );

    return savedDraft;
  }, []);

  const deleteDraft = useCallback(async (id:string) => {
    await removeDraft(id);

    setDrafts((current) =>
        current.filter(
            draft => draft.id !== id
        )
    );
  }, []);

  return {
    drafts: sortedDrafts,
    getAllDrafts,
    getDraft,
    createDraft,
    saveDraft,
    deleteDraft,
  }
}
