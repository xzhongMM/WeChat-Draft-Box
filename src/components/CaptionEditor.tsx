import { useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";

interface CaptionEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function CaptionEditor({ value, onChange }: CaptionEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = 'auto'

    const maxHeight = 160

    textarea.style.height =
      `${Math.min(textarea.scrollHeight, maxHeight)}px`
  }, [value])

  return (
    <label className="caption-editor">
      <textarea
        ref={textareaRef}
        value={value}
        rows={1}
        placeholder={t.captionDefault}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}
