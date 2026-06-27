interface CaptionEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function CaptionEditor({ value, onChange }: CaptionEditorProps) {
  return (
    <label className="caption-editor">
      <span>Caption</span>
      <textarea
        value={value}
        rows={5}
        placeholder="Write your WeChat caption..."
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}
