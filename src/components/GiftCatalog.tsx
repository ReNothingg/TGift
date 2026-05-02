import { useMemo } from 'react'
import { originalUrl } from '../api/changesApi'
import { normalizeSearch } from '../utils/format'
import { Icon } from './Icon'

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, index) => (
        <div className="gift-row skeleton-row" key={index}>
          <div className="thumb skeleton-box" />
          <div className="gift-row-main">
            <span className="skeleton-line wide" />
            <span className="skeleton-line" />
          </div>
        </div>
      ))}
    </>
  )
}

export function GiftCatalog({
  gifts,
  selectedGift,
  query,
  isLoading,
  onQueryChange,
  onSelectGift,
}: {
  gifts: string[]
  selectedGift: string
  query: string
  isLoading: boolean
  onQueryChange: (value: string) => void
  onSelectGift: (gift: string) => void
}) {
  const normalizedQuery = normalizeSearch(query)
  const filteredGifts = useMemo(() => {
    if (!normalizedQuery) return gifts
    return gifts.filter((gift) => normalizeSearch(gift).includes(normalizedQuery))
  }, [gifts, normalizedQuery])

  return (
    <aside className="catalog-panel" aria-label="Каталог подарков">
      <div className="panel-header">
        <div>
          <h2>Подарки Telegram</h2>
        </div>
        <span className="count-pill">{filteredGifts.length}</span>
      </div>

      <label className="search-field">
        <Icon name="search" />
        <input
          type="search"
          placeholder="Поиск подарка"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </label>

      <div className="catalog-list">
        {isLoading ? (
          <SkeletonRows />
        ) : filteredGifts.length > 0 ? (
          filteredGifts.map((gift) => (
            <button
              className={`gift-row ${gift === selectedGift ? 'selected' : ''}`}
              key={gift}
              type="button"
              onClick={() => onSelectGift(gift)}
            >
              <img className="thumb" src={originalUrl(gift, 128)} alt="" loading="lazy" />
              <span className="gift-row-main">
                <strong>{gift}</strong>
                <span>{gift === selectedGift ? 'Открыт сейчас' : 'Открыть вьювер'}</span>
              </span>
            </button>
          ))
        ) : (
          <div className="empty-state">
            <strong>Подарки не найдены</strong>
            <span>Попробуй другой запрос.</span>
          </div>
        )}
      </div>
    </aside>
  )
}
