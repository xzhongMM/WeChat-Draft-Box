import './App.css'
import { useEffect, useMemo, useState } from 'react'
import { useDrafts } from './hooks/useDrafts'
import { DraftEditorPage } from './pages/DraftEditorPage'
import { DraftListPage } from './pages/DraftListPage'

function App() {
  const { drafts, getDraft, createDraft, saveDraft, deleteDraft } = useDrafts()
  const redirected = sessionStorage.getItem("redirect");

  if (redirected) {
    sessionStorage.removeItem("redirect");
    window.history.replaceState(null, "", redirected);
  }
  const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

  function getPath() {
    const pathname = window.location.pathname;

    return pathname.startsWith(BASE)
      ? pathname.slice(BASE.length) || "/"
      : pathname;
  }
  const [path, setPath] = useState(getPath());

  useEffect(() => {
    const handlePopState = () => setPath(getPath());

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  function navigate(nextPath: string) {
    const url = import.meta.env.BASE_URL + nextPath.replace(/^\//, "");

    window.history.pushState(null, "", url);
    setPath(nextPath);
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
