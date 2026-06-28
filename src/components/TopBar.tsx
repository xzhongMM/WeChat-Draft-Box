import { useLanguage } from "../context/LanguageContext";

interface TopBarProps {
  onCancel: () => void;
  onSave: () => void;
  saveLabel?: string;
}

export function TopBar({ onCancel, onSave, saveLabel = useLanguage().t.saveDraft }: TopBarProps) {
  const { t } = useLanguage();

  return (
    <header className="top-bar">
      <button
        className="text-button danger"
        type="button"
        onClick={onCancel}
      >
        {t.cancel}
      </button>
      <button className="primary-button" type="button" onClick={onSave}>
        {saveLabel}
      </button>
    </header>
  )
}
