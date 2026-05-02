import { useMemo, useState } from 'react'
import { modelUrl, patternUrl } from '../api/changesApi'
import { fallbackBackdrop } from '../constants'
import type { AssetPanel, BackdropInfo, BackdropTrait, Trait } from '../types'
import { formatRarity, getRarityTone, normalizeSearch } from '../utils/format'
import { Icon } from './Icon'

export function AssetGallery({
  gift,
  panel,
  models,
  backdrops,
  symbols,
  selectedModelName,
  selectedBackdropName,
  selectedSymbolName,
  selectedBackdropInfo,
  onPanelChange,
  onModelChange,
  onBackdropChange,
  onSymbolChange,
}: {
  gift: string
  panel: AssetPanel
  models: Trait[]
  backdrops: BackdropTrait[]
  symbols: Trait[]
  selectedModelName: string
  selectedBackdropName: string
  selectedSymbolName: string
  selectedBackdropInfo: BackdropInfo | null
  onPanelChange: (panel: AssetPanel) => void
  onModelChange: (value: string) => void
  onBackdropChange: (value: string) => void
  onSymbolChange: (value: string) => void
}) {
  const [assetQuery, setAssetQuery] = useState('')
  const normalizedQuery = normalizeSearch(assetQuery)
  const panelMeta = {
    models: { label: 'Модели', count: models.length, placeholder: 'Поиск модели', empty: 'Модели не найдены' },
    backdrops: { label: 'Фоны', count: backdrops.length, placeholder: 'Поиск фона', empty: 'Фоны не найдены' },
    symbols: { label: 'Символы', count: symbols.length, placeholder: 'Поиск символа', empty: 'Символы не найдены' },
  } satisfies Record<AssetPanel, { label: string; count: number; placeholder: string; empty: string }>
  const items = panel === 'models' ? models : panel === 'backdrops' ? backdrops : symbols
  const filteredItems = useMemo(() => {
    if (!normalizedQuery) return items
    return items.filter((item) => normalizeSearch(item.name).includes(normalizedQuery))
  }, [items, normalizedQuery])

  return (
    <section className="asset-gallery" aria-label="Вьювер слоев подарка">
      <div className="gallery-head">
        <div>
          <p className="panel-kicker">Все варианты</p>
          <h3>{panelMeta[panel].label}</h3>
        </div>
        <span className="count-pill">{panelMeta[panel].count}</span>
      </div>

      <div className="mini-segmented layer-tabs" aria-label="Тип слоя">
        {(Object.keys(panelMeta) as AssetPanel[]).map((key) => (
          <button className={panel === key ? 'active' : ''} type="button" onClick={() => onPanelChange(key)} key={key}>
            {panelMeta[key].label}
          </button>
        ))}
      </div>

      <label className="search-field compact">
        <Icon name="search" />
        <input
          type="search"
          placeholder={panelMeta[panel].placeholder}
          value={assetQuery}
          onChange={(event) => setAssetQuery(event.target.value)}
        />
      </label>

      <div className={`asset-grid ${panel}`}>
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const isSelected =
              panel === 'models'
                ? item.name === selectedModelName
                : panel === 'backdrops'
                  ? item.name === selectedBackdropName
                  : item.name === selectedSymbolName
            const colors =
              panel === 'backdrops'
                ? ((item as BackdropTrait).hex ??
                  (item.name === selectedBackdropName ? selectedBackdropInfo?.hex : null) ??
                  fallbackBackdrop.hex!)
                : fallbackBackdrop.hex!
            const onClick =
              panel === 'models'
                ? () => onModelChange(item.name)
                : panel === 'backdrops'
                  ? () => onBackdropChange(item.name)
                  : () => onSymbolChange(item.name)

            return (
              <button
                className={`asset-tile ${isSelected ? 'selected' : ''}`}
                type="button"
                aria-pressed={isSelected}
                onClick={onClick}
                key={`${panel}:${item.name}`}
              >
                <span className="asset-preview">
                  {panel === 'models' && gift ? <img src={modelUrl(gift, item.name, 128)} alt="" loading="lazy" /> : null}
                  {panel === 'symbols' && gift ? <img src={patternUrl(gift, item.name, 128)} alt="" loading="lazy" /> : null}
                  {panel === 'backdrops' ? (
                    <span
                      className="asset-backdrop-preview"
                      style={{
                        background: `radial-gradient(circle at 35% 30%, ${colors.centerColor}, ${colors.edgeColor})`,
                      }}
                    />
                  ) : null}
                </span>
                <strong>{item.name}</strong>
                <span className={`rarity-pill ${getRarityTone(item.rarity)}`}>{formatRarity(item.rarity)}</span>
              </button>
            )
          })
        ) : (
          <div className="empty-state gallery-empty">
            <strong>{panelMeta[panel].empty}</strong>
            <span>Попробуй другой запрос.</span>
          </div>
        )}
      </div>
    </section>
  )
}
