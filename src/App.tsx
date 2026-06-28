import './App.css'
import { useEffect, useMemo, useState } from 'react'
import { useDrafts } from './hooks/useDrafts'
import { DraftEditorPage } from './pages/DraftEditorPage'
import { DraftListPage } from './pages/DraftListPage'

function App() {
  const { drafts, getDraft, createDraft, saveDraft, deleteDraft } = useDrafts()
  const getPath = () => window.location.hash.slice(1) || "/";
  const [path, setPath] = useState(getPath());

  useEffect(() => {
    const handleHashChange = () => setPath(getPath());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  function navigate(nextPath: string) {
    window.location.hash = nextPath;
  }

  function handleCreateDraft() {
    const draft = createDraft()
    navigate(`/draft/${draft.id}`)
  }

  const activeDraftId = useMemo(() => {
    const match = path.match(/^\/draft\/(.+)$/)
    return match?.[1]
  }, [path])

  const activeDraft = activeDraftId ? getDraft(activeDraftId) : undefined

  if (activeDraftId && activeDraft) {
    return (
      <DraftEditorPage
        draft={activeDraft}
        onSave={(draft) => {
          saveDraft(draft)
          navigate('/')
        }}
        onDiscard={(id) => {
          deleteDraft(id)
          navigate('/')
        }}
        onCancelChanges={() => {
          navigate("/")
        }}
      />
    )
  }

  return (
    <DraftListPage
      drafts={drafts}
      onCreateDraft={handleCreateDraft}
      onOpenDraft={(id) => navigate(`/draft/${id}`)}
    />
  )
}

export default App
