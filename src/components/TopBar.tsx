interface TopBarProps {
  onDiscard: () => void;
  onSave: () => void;
  saveLabel?: string;
}

export function TopBar({ onDiscard, onSave, saveLabel = 'Save Draft' }: TopBarProps) {
  return (
    <header className="top-bar">
      <button className="text-button danger" type="button" onClick={onDiscard}>
        Discard Draft
      </button>
      <button className="primary-button" type="button" onClick={onSave}>
        {saveLabel}
      </button>
    </header>
  )
}
