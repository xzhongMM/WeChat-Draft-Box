import { useEffect, useMemo, useState } from 'react'
import { CaptionEditor } from '../components/CaptionEditor'
import { ImageGrid } from '../components/ImageGrid'
import { ImageViewer } from '../components/ImageViewer'
import { TopBar } from '../components/TopBar'
import type { Draft } from '../types/Draft'
import { useLanguage } from '../context/LanguageContext'
import { uploadImages, removeImage } from "../utils/api";

interface DraftEditorPageProps {
  draft: Draft;
  onSave: (draft: Draft) => void;
  onDiscard: (id: string) => void;
  onCancelChanges: () => void;
}

export function DraftEditorPage({ draft, onSave, onDiscard, onCancelChanges }: DraftEditorPageProps) {
  const [workingDraft, setWorkingDraft] = useState(draft)
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  useEffect(() => {
    setWorkingDraft(draft)
    setUploadedImages([])
  }, [draft])

  const remainingSlots = useMemo(() => 9 - workingDraft.images.length, [workingDraft.images.length])

  function handleCaptionChange(caption: string) {
    setWorkingDraft((currentDraft) => ({ ...currentDraft, caption }))
  }

  async function handleAddImages(files: FileList) {
    const availableFiles = Array.from(files).slice(0, remainingSlots);

    if (availableFiles.length === 0) {
      return;
    }

    const imageUrls = await uploadImages(availableFiles);

    setUploadedImages((currentImages) => [
      ...currentImages,
      ...imageUrls,
    ]);

    setWorkingDraft((currentDraft) => ({
      ...currentDraft,
      images: [...currentDraft.images, ...imageUrls].slice(0, 9),
    }));
  }

  async function cleanupUploadedImages() {
    await Promise.all(
      uploadedImages.map((image) => removeImage(image))
    )
  }

  async function handleSave() {
    const imagesToDelete = uploadedImages.filter(
      (image) => !workingDraft.images.includes(image)
    )

    await Promise.all(
      imagesToDelete.map((image) => removeImage(image))
    )

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

  const { t } = useLanguage();

  return (
    <main className="draft-editor-page">
      <TopBar
        onCancel={() => setIsConfirmingCancel(true)}
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
        <p className="image-count">{workingDraft.images.length}/9 {t.images}</p>
      </section>

      <section className="like-section">
        <p className="like-text">♡ Mo</p>
        <p className="comment-text"><span className="comment-user">Mo</span>: {t.comment}</p>
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

      {isConfirmingCancel ? (
        <div
          className="confirm-backdrop"
          role="alertdialog"
          aria-modal="true"
          aria-label="Leave draft"
        >
          <div className="confirm-dialog">
            <h2>{t.leaveDraft}</h2>

            <p>{t.unsavedChanges}</p>

            <div className="confirm-actions vertical">

              <button
                type="button"
                className="viewer-button"
                onClick={() => setIsConfirmingCancel(false)}
              >
                {t.continueEditing}
              </button>

              <button
                type="button"
                className="viewer-button cancel"
                onClick={async () => {
                  setIsConfirmingCancel(false)
                  await cleanupUploadedImages()
                  onCancelChanges()
                }}
              >
                {t.cancelChanges}
              </button>

              <button
                type="button"
                className="viewer-button delete"
                onClick={async () => {
                  setIsConfirmingCancel(false)
                  await cleanupUploadedImages()
                  onDiscard(workingDraft.id)
                }}
              >
                {t.discardDraft}
              </button>

            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}
