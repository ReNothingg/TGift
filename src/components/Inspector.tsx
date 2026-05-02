import { useMemo, useState } from 'react'
import { backdropInfoUrl, giftJsonUrl, modelJsonUrl, originalJsonUrl, symbolJsonUrl } from '../api/changesApi'
import { fallbackBackdrop } from '../constants'
import type { AssetPanel, BackdropInfo, CopyState, GiftDetail, Tab, TraitSort } from '../types'
import { backdropToInfo } from '../utils/backdrops'
import { sortTraits } from '../utils/format'
import { AssetGallery } from './AssetGallery'
import { EndpointRow } from './EndpointRow'
import { Icon } from './Icon'
import { RarityMeter } from './RarityMeter'

export function Inspector({
  detail,
  tab,
  traitSort,
  selectedModelName,
  selectedBackdropName,
  selectedSymbolName,
  backdropInfo,
  copyState,
  onSortChange,
  onModelChange,
  onBackdropChange,
  onSymbolChange,
  onRandomize,
  onOpenActive,
  onCopyActive,
  onCopyEndpoint,
}: {
  detail: GiftDetail | null
  tab: Tab
  traitSort: TraitSort
  selectedModelName: string
  selectedBackdropName: string
  selectedSymbolName: string
  backdropInfo: BackdropInfo | null
  copyState: CopyState
  onSortChange: (sort: TraitSort) => void
  onModelChange: (value: string) => void
  onBackdropChange: (value: string) => void
  onSymbolChange: (value: string) => void
  onRandomize: () => void
  onOpenActive: () => void
  onCopyActive: () => void
  onCopyEndpoint: (value: string) => void
}) {
  const [assetPanel, setAssetPanel] = useState<AssetPanel>('models')
  const models = useMemo(() => sortTraits(detail?.models ?? [], traitSort), [detail?.models, traitSort])
  const backdrops = useMemo(() => sortTraits(detail?.backdrops ?? [], traitSort), [detail?.backdrops, traitSort])
  const symbols = useMemo(() => sortTraits(detail?.symbols ?? [], traitSort), [detail?.symbols, traitSort])
  const selectedModel = detail?.models.find((item) => item.name === selectedModelName)
  const selectedBackdrop = detail?.backdrops.find((item) => item.name === selectedBackdropName)
  const selectedSymbol = detail?.symbols.find((item) => item.name === selectedSymbolName)
  const selectedBackdropInfo = backdropToInfo(selectedBackdrop) ?? backdropInfo
  const backdropColors = selectedBackdropInfo?.hex ?? fallbackBackdrop.hex!
  const giftName = detail?.gift.name ?? ''
  const activeCopyLabel = copyState === 'copied' ? 'Скопировано' : copyState === 'failed' ? 'Не скопировалось' : 'Скопировать JSON'

  return (
    <aside className="inspector-panel" aria-label="Настройки NFT">
      <div className="panel-header">
        <div>
          <p className="panel-kicker">Настройка</p>
          <h2>{tab === 'nft' ? 'NFT-вариант' : 'Обычный подарок'}</h2>
        </div>
        <button
          className="icon-button"
          type="button"
          onClick={onRandomize}
          title="Случайный вариант"
          aria-label="Случайный вариант"
        >
          <Icon name="shuffle" />
        </button>
      </div>

      <div className="sort-row">
        <span>Сортировка</span>
        <div className="mini-segmented" aria-label="Сортировка слоев">
          <button className={traitSort === 'rarity' ? 'active' : ''} type="button" onClick={() => onSortChange('rarity')}>
            Редкость
          </button>
          <button className={traitSort === 'name' ? 'active' : ''} type="button" onClick={() => onSortChange('name')}>
            A-Z
          </button>
        </div>
      </div>

      <AssetGallery
        gift={giftName}
        panel={assetPanel}
        models={models}
        backdrops={backdrops}
        symbols={symbols}
        selectedModelName={selectedModelName}
        selectedBackdropName={selectedBackdropName}
        selectedSymbolName={selectedSymbolName}
        selectedBackdropInfo={selectedBackdropInfo}
        onPanelChange={setAssetPanel}
        onModelChange={onModelChange}
        onBackdropChange={onBackdropChange}
        onSymbolChange={onSymbolChange}
      />

      <RarityMeter model={selectedModel} backdrop={selectedBackdrop} symbol={selectedSymbol} />

      <section className="meta-panel" aria-label="Метаданные подарка">
        <h3>Данные подарка</h3>
        <dl>
          <div>
            <dt>Название</dt>
            <dd>{detail?.gift.name ?? '...'}</dd>
          </div>
          <div>
            <dt>ID подарка</dt>
            <dd>{detail?.gift.id ?? '...'}</dd>
          </div>
          <div>
            <dt>Emoji ID</dt>
            <dd>{detail?.gift.customEmojiId ?? '...'}</dd>
          </div>
          <div>
            <dt>Фон</dt>
            <dd style={{ color: backdropColors.textColor }}>{(selectedBackdropInfo?.name ?? selectedBackdropName) || '...'}</dd>
          </div>
          <div>
            <dt>Формат</dt>
            <dd>Lottie JSON</dd>
          </div>
        </dl>
      </section>

      <div className="asset-actions">
        <button type="button" onClick={onOpenActive}>
          <Icon name="open" />
          Открыть JSON
        </button>
        <button type="button" onClick={onCopyActive}>
          <Icon name="copy" />
          {activeCopyLabel}
        </button>
      </div>

      {detail ? (
        <section className="endpoint-panel" aria-label="API эндпоинты">
          <h3>JSON эндпоинты</h3>
          <EndpointRow label="Подарок JSON" value={giftJsonUrl(giftName)} onCopy={onCopyEndpoint} />
          <EndpointRow label="Оригинал JSON" value={originalJsonUrl(giftName)} onCopy={onCopyEndpoint} />
          {selectedModel ? (
            <EndpointRow label="Модель JSON" value={modelJsonUrl(giftName, selectedModel.name)} onCopy={onCopyEndpoint} />
          ) : null}
          {selectedSymbol ? (
            <EndpointRow label="Символ JSON" value={symbolJsonUrl(giftName, selectedSymbol.name)} onCopy={onCopyEndpoint} />
          ) : null}
          {selectedBackdrop ? (
            <EndpointRow label="Фон JSON" value={backdropInfoUrl(giftName, selectedBackdrop.name)} onCopy={onCopyEndpoint} />
          ) : null}
        </section>
      ) : null}
    </aside>
  )
}
