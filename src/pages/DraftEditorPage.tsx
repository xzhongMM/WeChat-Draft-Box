import { useEffect, useMemo, useState } from 'react'
import { CaptionEditor } from '../components/CaptionEditor'
import { ImageGrid } from '../components/ImageGrid'
import { ImageViewer } from '../components/ImageViewer'
import { TopBar } from '../components/TopBar'
import type { Draft } from '../types/Draft'

interface DraftEditorPageProps {
  draft: Draft;
  onSave: (draft: Draft) => void;
  onDiscard: (id: string) => void;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(String(reader.result)))
    reader.addEventListener('error', () => reject(reader.error))
    reader.readAsDataURL(file)
  })
}

export function DraftEditorPage({ draft, onSave, onDiscard }: DraftEditorPageProps) {
  const [workingDraft, setWorkingDraft] = useState(draft)
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)

  useEffect(() => {
    setWorkingDraft(draft)
  }, [draft])

  const remainingSlots = useMemo(() => 9 - workingDraft.images.length, [workingDraft.images.length])

  function handleCaptionChange(caption: string) {
    setWorkingDraft((currentDraft) => ({ ...currentDraft, caption }))
  }

  async function handleAddImages(files: FileList) {
    const availableFiles = Array.from(files).slice(0, remainingSlots)

    if (availableFiles.length === 0) {
      return
    }

    const imageUrls = await Promise.all(availableFiles.map(readFileAsDataUrl))
    setWorkingDraft((currentDraft) => ({
      ...currentDraft,
      images: [...currentDraft.images, ...imageUrls].slice(0, 9),
    }))
  }

  function handleSave() {
    onSave(workingDraft)
  }

  function handleDeleteImage(index: number) {
    setWorkingDraft((currentDraft) => {
      const nextImages = currentDraft.images.filter((_, imageIndex) => imageIndex !== index)
      const nextIndex = Math.min(index, nextImages.length - 1)
      setViewerIndex(nextIndex >= 0 ? nextIndex : null)

      return {
        ...currentDraft,
        images: nextImages,
      }
    })
  }

  function handleReorderImages(fromIndex: number, toIndex: number) {
    setWorkingDraft((currentDraft) => {
      const nextImages = [...currentDraft.images]
      const [movedImage] = nextImages.splice(fromIndex, 1)

      if (!movedImage) {
        return currentDraft
      }

      nextImages.splice(toIndex, 0, movedImage)

      return {
        ...currentDraft,
        images: nextImages,
      }
    })
  }

  return (
    <main className="draft-editor-page">
      <TopBar
        onDiscard={() => onDiscard(workingDraft.id)}
        onSave={handleSave}
      />

      <section className="editor-surface">
        <CaptionEditor value={workingDraft.caption} onChange={handleCaptionChange} />
        <ImageGrid
          images={workingDraft.images}
          mode="editor"
          onAddImages={handleAddImages}
          onImageClick={setViewerIndex}
          onReorderImages={handleReorderImages}
        />
        <p className="image-count">{workingDraft.images.length}/9 images</p>
      </section>

      {viewerIndex !== null ? (
        <ImageViewer
          images={workingDraft.images}
          activeIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
          onDelete={handleDeleteImage}
          onSelect={setViewerIndex}
        />
      ) : null}
    </main>
  )
}
