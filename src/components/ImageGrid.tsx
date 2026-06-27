import type { CSSProperties } from 'react'

type GridMode = 'preview' | 'editor'

interface ImageGridProps {
  images: string[];
  mode: GridMode;
  onAddImages?: (files: FileList) => void;
  onImageClick?: (index: number) => void;
  onReorderImages?: (fromIndex: number, toIndex: number) => void;
}

const previewColumnsByCount: Record<number, number> = {
  1: 1,
  2: 2,
  3: 3,
  4: 2,
  5: 3,
  6: 3,
  7: 3,
  8: 3,
  9: 3,
}

export function ImageGrid({
  images,
  mode,
  onAddImages,
  onImageClick,
  onReorderImages,
}: ImageGridProps) {
  const canAddImages = mode === 'editor' && images.length < 9
  const columnCount = mode === 'preview' ? previewColumnsByCount[images.length] ?? 3 : 3
  const className = `image-grid ${mode === 'preview' ? 'preview-grid' : 'editor-grid'}`
  const gridStyle = { '--grid-columns': columnCount } as CSSProperties
  const canReorder = mode === 'editor' && Boolean(onReorderImages)

  return (
    <div className={className} style={gridStyle}>
      {images.map((image, index) => (
        <button
          className="image-tile"
          type="button"
          key={`${image}-${index}`}
          draggable={canReorder}
          onDragStart={(event) => {
            event.dataTransfer.effectAllowed = 'move'
            event.dataTransfer.setData('text/plain', String(index))
          }}
          onDragOver={(event) => {
            if (canReorder) {
              event.preventDefault()
              event.dataTransfer.dropEffect = 'move'
            }
          }}
          onDrop={(event) => {
            event.preventDefault()
            const fromIndex = Number(event.dataTransfer.getData('text/plain'))

            if (Number.isInteger(fromIndex) && fromIndex !== index) {
              onReorderImages?.(fromIndex, index)
            }
          }}
          onClick={() => onImageClick?.(index)}
          aria-label={`Open image ${index + 1}`}
        >
          <img src={image} alt="" />
        </button>
      ))}

      {canAddImages ? (
        <label className="add-image-tile" aria-label="Add images">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => {
              if (event.target.files) {
                onAddImages?.(event.target.files)
              }

              event.target.value = ''
            }}
          />
          <span>+</span>
        </label>
      ) : null}
    </div>
  )
}
