import { useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext';

interface ImageViewerProps {
  images: string[];
  activeIndex: number;
  onClose: () => void;
  onDelete: (index: number) => void;
  onSelect: (index: number) => void;
}

export function ImageViewer({
  images,
  activeIndex,
  onClose,
  onDelete,
  onSelect,
}: ImageViewerProps) {
  const activeImage = images[activeIndex]
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const panStartRef = useRef({
    isPanning: false,
    scrollLeft: 0,
    scrollTop: 0,
    x: 0,
    y: 0,
  })

  if (!activeImage) {
    return null
  }

  const showPrevious = activeIndex > 0
  const showNext = activeIndex < images.length - 1
  const { t } = useLanguage();
  return (
    <div className="image-viewer" role="dialog" aria-modal="true" aria-label="Image viewer">
      <header className="viewer-header">
        <button className="viewer-button" type="button" onClick={onClose}>
          {t.close}
        </button>
        <button className="viewer-button delete" type="button" onClick={() => setIsConfirmingDelete(true)}>
          {t.delete}
        </button>
      </header>

      <div className="viewer-stage">
        <button
          className="viewer-nav previous"
          type="button"
          onClick={() => onSelect(activeIndex - 1)}
          disabled={!showPrevious}
          aria-label="Previous image"
        >
          &lt;
        </button>

        <img
          className="viewer-image"
          src={activeImage}
          alt=""
        />

        <button
          className="viewer-nav next"
          type="button"
          onClick={() => onSelect(activeIndex + 1)}
          disabled={!showNext}
          aria-label="Next image"
        >
          &gt;
        </button>
      </div>

      <div className="viewer-dots" aria-label={`${activeIndex + 1} of ${images.length}`}>
        {images.map((image, index) => (
          <button
            type="button"
            key={`${image}-${index}`}
            className={index === activeIndex ? 'active' : ''}
            onClick={() => onSelect(index)}
            aria-label={`View image ${index + 1}`}
          />
        ))}
      </div>

      {isConfirmingDelete ? (
        <div className="confirm-backdrop" role="alertdialog" aria-modal="true" aria-label="Delete image">
          <div className="confirm-dialog">
            <h2>{t.deleteImage}</h2>
            <p>{t.deleteImageDescription}</p>
            <div className="confirm-actions">
              <button type="button" className="viewer-button" onClick={() => setIsConfirmingDelete(false)}>
                {t.cancel}
              </button>
              <button
                type="button"
                className="viewer-button delete"
                onClick={() => {
                  setIsConfirmingDelete(false)
                  onDelete(activeIndex)
                }}
              >
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
