import './App.css'
import { useEffect, useMemo, useState } from 'react'
import { useDrafts } from './hooks/useDrafts'
import { DraftEditorPage } from './pages/DraftEditorPage'
import { DraftListPage } from './pages/DraftListPage'

function App() {
  const { drafts, getDraft, createDraft, saveDraft, deleteDraft } = useDrafts()
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  function navigate(nextPath: string) {
    window.history.pushState(null, '', nextPath)
    setPath(nextPath)
  }

  function handleCreateDraft() {
    const draft = createDraft()
    navigate(`/draft/${draft.id}`)
  }

  function handleCancelChanges() {
    // Throw away local edits
    navigate("/")
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
