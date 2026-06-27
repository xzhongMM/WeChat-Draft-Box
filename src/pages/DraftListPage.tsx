import { DraftCard } from '../components/DraftCard'
import type { Draft } from '../types/Draft'

interface DraftListPageProps {
  drafts: Draft[];
  onCreateDraft: () => void;
  onOpenDraft: (id: string) => void;
}

export function DraftListPage({ drafts, onCreateDraft, onOpenDraft }: DraftListPageProps) {
  return (
    <main className="draft-list-page">
      <header className="home-header">
        <div>
          <p className="eyebrow">WeChat Draft Box</p>
          <h1>My Drafts</h1>
        </div>
        <button className="new-draft-button" type="button" onClick={onCreateDraft}>
          + New Draft
        </button>
      </header>

      {drafts.length > 0 ? (
        <section className="draft-list" aria-label="Saved drafts">
          {drafts.map((draft) => (
            <DraftCard key={draft.id} draft={draft} onOpen={() => onOpenDraft(draft.id)} />
          ))}
        </section>
      ) : (
        <section className="empty-state">
          <h2>No drafts yet</h2>
          <p>Start a post, try a few captions, and keep the images ready for WeChat.</p>
          <button className="primary-button" type="button" onClick={onCreateDraft}>
            Create Draft
          </button>
        </section>
      )}
    </main>
  )
}
