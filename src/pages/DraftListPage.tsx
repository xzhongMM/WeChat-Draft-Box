import { DraftCard } from '../components/DraftCard'
import { useLanguage } from '../context/LanguageContext';
import type { Draft } from '../types/Draft'

interface DraftListPageProps {
  drafts: Draft[];
  onCreateDraft: () => void;
  onOpenDraft: (id: string) => void;
}

export function DraftListPage({ drafts, onCreateDraft, onOpenDraft }: DraftListPageProps) {
  const { t } = useLanguage();
  const { language, setLanguage } = useLanguage();

  return (
    <main className="draft-list-page">
      <header className="home-header">
        <div>
          <p className="eyebrow">{t.appName}</p>
          <h1>{t.listPageTitle}</h1>
        </div>
  
        <button className="new-draft-button" type="button" onClick={onCreateDraft}>
          {t.newDraftButton}
        </button>
      </header>

      <div className="draft-list-content">
        {drafts.length > 0 ? (
          <section className="draft-list" aria-label="Saved drafts">
            {drafts.map((draft) => (
              <DraftCard key={draft.id} draft={draft} onOpen={() => onOpenDraft(draft.id)} />
            ))}
          </section>
        ) : (
          <section className="empty-state">
            <h2>{t.emptyStateTitle}</h2>
            <p>{t.emptyStateDescription}</p>
            <button className="primary-button" type="button" onClick={onCreateDraft}>
              {t.createDraftButton}
            </button>
          </section>
        )}
      </div>

      <footer className="footer">
        <select  
          className="language-selector"
          value={language}
          onChange={(e) =>
            setLanguage(e.target.value as "en" | "zh")
          }
        >
          <option value="en">English</option>
          <option value="zh">中文</option>
        </select>
      </footer>
    </main>
  )
}
