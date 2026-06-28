interface TopBarProps {
  onCancel: () => void;
  onDiscard: () => void;
  onSave: () => void;
  saveLabel?: string;
}

export function TopBar({ onCancel, onDiscard, onSave, saveLabel = 'Save Draft' }: TopBarProps) {
  return (
    <header className="top-bar">
      <button
        className="text-button danger"
        type="button"
        onClick={onCancel}
      >
          Cancel
      </button>
      <button className="primary-button" type="button" onClick={onSave}>
        {saveLabel}
      </button>
    </header>
  )
}
