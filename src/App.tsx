import { useEffect, useRef, useState } from 'react'
import {
  apiUrl,
  backdropInfoUrl,
  backdropsUrl,
  fetchJson,
  giftJsonUrl,
  modelJsonUrl,
  originalJsonUrl,
} from './api/changesApi'
import './App.css'
import { GiftCatalog } from './components/GiftCatalog'
import { Icon } from './components/Icon'
import { Inspector } from './components/Inspector'
import { LayerStrip } from './components/LayerStrip'
import { PreviewStage } from './components/PreviewStage'
import { SegmentedTabs } from './components/SegmentedTabs'
import { StatTile } from './components/StatTile'
import { API_BASE, INITIAL_GIFT } from './constants'
import type { BackdropInfo, CopyState, GiftDetail, Tab, Totals, TraitSort } from './types'
import { backdropToInfo, mergeBackdropInfo } from './utils/backdrops'
import { getRandomItem } from './utils/format'

function App() {
  const [gifts, setGifts] = useState<string[]>([])
  const [totals, setTotals] = useState<Totals | null>(null)
  const [selectedGiftName, setSelectedGiftName] = useState('')
  const [giftDetail, setGiftDetail] = useState<GiftDetail | null>(null)
  const [selectedModelName, setSelectedModelName] = useState('')
  const [selectedBackdropName, setSelectedBackdropName] = useState('')
  const [selectedSymbolName, setSelectedSymbolName] = useState('')
  const [backdropInfoState, setBackdropInfoState] = useState<{ cacheKey: string; info: BackdropInfo } | null>(null)
  const [tab, setTab] = useState<Tab>('nft')
  const [traitSort, setTraitSort] = useState<TraitSort>('rarity')
  const [query, setQuery] = useState('')
  const [zoom, setZoom] = useState(1)
  const [isBooting, setIsBooting] = useState(true)
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [error, setError] = useState('')
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const detailCache = useRef(new Map<string, GiftDetail>())
  const copyTimer = useRef<number | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadCatalog() {
      try {
        setIsBooting(true)
        setError('')
        const [giftNames, totalStats] = await Promise.all([
          fetchJson<string[]>(apiUrl('/gifts'), controller.signal),
          fetchJson<Totals>(apiUrl('/total'), controller.signal),
        ])
        setGifts(giftNames)
        setTotals(totalStats)
        setSelectedGiftName(giftNames.includes(INITIAL_GIFT) ? INITIAL_GIFT : giftNames[0] ?? '')
      } catch (caught) {
        if (caught instanceof DOMException && caught.name === 'AbortError') return
        setError('Не удалось загрузить подарки с api.changes.tg.')
      } finally {
        setIsBooting(false)
      }
    }

    loadCatalog()

    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (!selectedGiftName) return

    const cached = detailCache.current.get(selectedGiftName)
    if (cached) {
      setGiftDetail(cached)
      return
    }

    const controller = new AbortController()

    async function loadDetail() {
      try {
        setIsDetailLoading(true)
        setError('')
        const [detail, backdropList] = await Promise.all([
          fetchJson<GiftDetail>(giftJsonUrl(selectedGiftName), controller.signal),
          fetchJson<BackdropInfo[]>(backdropsUrl(selectedGiftName), controller.signal).catch(() => null),
        ])
        const enrichedDetail = mergeBackdropInfo(detail, backdropList)
        detailCache.current.set(selectedGiftName, enrichedDetail)
        setGiftDetail(enrichedDetail)
      } catch (caught) {
        if (caught instanceof DOMException && caught.name === 'AbortError') return
        setGiftDetail(null)
        setError(`Не удалось загрузить "${selectedGiftName}".`)
      } finally {
        setIsDetailLoading(false)
      }
    }

    loadDetail()

    return () => controller.abort()
  }, [selectedGiftName])

  const activeDetail = giftDetail?.gift.name === selectedGiftName ? giftDetail : null
  const effectiveModelName =
    activeDetail && activeDetail.models.some((item) => item.name === selectedModelName)
      ? selectedModelName
      : (activeDetail?.models[0]?.name ?? '')
  const effectiveBackdropName =
    activeDetail && activeDetail.backdrops.some((item) => item.name === selectedBackdropName)
      ? selectedBackdropName
      : (activeDetail?.backdrops[0]?.name ?? '')
  const effectiveSymbolName =
    activeDetail && activeDetail.symbols.some((item) => item.name === selectedSymbolName)
      ? selectedSymbolName
      : (activeDetail?.symbols[0]?.name ?? '')
  const selectedModel = activeDetail?.models.find((item) => item.name === effectiveModelName)
  const selectedBackdrop = activeDetail?.backdrops.find((item) => item.name === effectiveBackdropName)
  const selectedSymbol = activeDetail?.symbols.find((item) => item.name === effectiveSymbolName)
  const currentBackdropKey = selectedGiftName && effectiveBackdropName ? `${selectedGiftName}:${effectiveBackdropName}` : ''
  const selectedBackdropInfo = backdropToInfo(selectedBackdrop)
  const backdropInfo = selectedBackdropInfo ?? (backdropInfoState?.cacheKey === currentBackdropKey ? backdropInfoState.info : null)
  const selectedBackdropHasColors = Boolean(selectedBackdropInfo)

  useEffect(() => {
    if (!currentBackdropKey || !effectiveBackdropName || selectedBackdropHasColors) {
      return
    }

    const controller = new AbortController()

    async function loadBackdrop() {
      try {
        const info = await fetchJson<BackdropInfo>(backdropInfoUrl(selectedGiftName, effectiveBackdropName), controller.signal)
        setBackdropInfoState({ cacheKey: currentBackdropKey, info })
      } catch (caught) {
        if (caught instanceof DOMException && caught.name === 'AbortError') return
        setBackdropInfoState(null)
      }
    }

    loadBackdrop()

    return () => controller.abort()
  }, [currentBackdropKey, effectiveBackdropName, selectedBackdropHasColors, selectedGiftName])

  useEffect(() => {
    return () => {
      if (copyTimer.current) {
        window.clearTimeout(copyTimer.current)
      }
    }
  }, [])

  const activeUrl =
    tab === 'original'
      ? selectedGiftName
        ? originalJsonUrl(selectedGiftName)
        : ''
      : selectedGiftName && effectiveModelName
        ? modelJsonUrl(selectedGiftName, effectiveModelName)
        : ''

  function handleSelectGift(gift: string) {
    setSelectedGiftName(gift)
    setSelectedModelName('')
    setSelectedBackdropName('')
    setSelectedSymbolName('')
    setZoom(1)
  }

  function randomizeVariant() {
    if (!activeDetail) return

    const model = getRandomItem(activeDetail.models)
    const backdrop = getRandomItem(activeDetail.backdrops)
    const symbol = getRandomItem(activeDetail.symbols)

    if (model) setSelectedModelName(model.name)
    if (backdrop) setSelectedBackdropName(backdrop.name)
    if (symbol) setSelectedSymbolName(symbol.name)
    setTab('nft')
  }

  async function copyToClipboard(value: string) {
    if (!value) return

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = value
        textArea.setAttribute('readonly', 'true')
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.append(textArea)
        textArea.select()
        document.execCommand('copy')
        textArea.remove()
      }

      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }

    if (copyTimer.current) {
      window.clearTimeout(copyTimer.current)
    }

    copyTimer.current = window.setTimeout(() => setCopyState('idle'), 1600)
  }

  function openActiveUrl() {
    if (!activeUrl) return
    window.open(activeUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">
            <Icon name="gift" />
          </span>
          <div>
            <h1>TGift</h1>
            <p>api.changes.tg</p>
          </div>
        </div>

        <div className="stats-row" aria-label="Статистика API">
          <StatTile label="Подарки" value={totals?.gifts} />
          <StatTile label="Модели" value={totals?.models} />
          <StatTile label="Фоны" value={totals?.backdrops} />
          <StatTile label="Символы" value={totals?.patterns} />
        </div>

        <a className="docs-link" href={API_BASE} target="_blank" rel="noreferrer">
          Документация API
        </a>
      </header>

      {error ? (
        <div className="error-banner" role="alert">
          {error}
        </div>
      ) : null}

      <div className="workspace">
        <GiftCatalog
          gifts={gifts}
          selectedGift={selectedGiftName}
          query={query}
          isLoading={isBooting}
          onQueryChange={setQuery}
          onSelectGift={handleSelectGift}
        />

        <section className="viewer-panel" aria-label="Предпросмотр подарка">
          <div className="viewer-header">
            <SegmentedTabs tab={tab} onChange={setTab} />
            <div className="viewer-title">
              <strong>{(activeDetail?.gift.name ?? selectedGiftName) || 'Загрузка...'}</strong>
            </div>
          </div>

          <PreviewStage
            tab={tab}
            gift={selectedGiftName}
            selectedModel={selectedModel}
            selectedSymbol={selectedSymbol}
            backdrop={backdropInfo}
            zoom={zoom}
            isLoading={isDetailLoading}
          />

          <div className="preview-controls" aria-label="Управление предпросмотром">
            <button
              type="button"
              aria-label="Уменьшить"
              onClick={() => setZoom((value) => Math.max(0.8, Number((value - 0.1).toFixed(2))))}
            >
              -
            </button>
            <input
              aria-label="Масштаб предпросмотра"
              type="range"
              min="0.8"
              max="1.25"
              step="0.05"
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
            />
            <button
              type="button"
              aria-label="Увеличить"
              onClick={() => setZoom((value) => Math.min(1.25, Number((value + 0.1).toFixed(2))))}
            >
              +
            </button>
            <span>{Math.round(zoom * 100)}%</span>
          </div>

          {tab === 'nft' ? (
            <LayerStrip gift={selectedGiftName} model={selectedModel} backdrop={backdropInfo} symbol={selectedSymbol} />
          ) : (
            <div className="original-summary">
              <Icon name="gift" />
              <div>
                <strong>Обычный подарок Telegram</strong>
                <span>Предпросмотр тоже идет из Lottie JSON: `/original/:gift.json`.</span>
              </div>
            </div>
          )}
        </section>

        <Inspector
          detail={activeDetail}
          tab={tab}
          traitSort={traitSort}
          selectedModelName={effectiveModelName}
          selectedBackdropName={effectiveBackdropName}
          selectedSymbolName={effectiveSymbolName}
          backdropInfo={backdropInfo}
          copyState={copyState}
          onSortChange={setTraitSort}
          onModelChange={setSelectedModelName}
          onBackdropChange={setSelectedBackdropName}
          onSymbolChange={setSelectedSymbolName}
          onRandomize={randomizeVariant}
          onOpenActive={openActiveUrl}
          onCopyActive={() => copyToClipboard(activeUrl)}
          onCopyEndpoint={copyToClipboard}
        />
      </div>
    </main>
  )
}

export default App
