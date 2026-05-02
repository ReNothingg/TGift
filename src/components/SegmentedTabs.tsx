import type { Tab } from '../types'

export function SegmentedTabs({ tab, onChange }: { tab: Tab; onChange: (tab: Tab) => void }) {
  return (
    <div className="segmented" role="tablist" aria-label="Режим предпросмотра">
      <button
        className={tab === 'nft' ? 'active' : ''}
        type="button"
        role="tab"
        aria-selected={tab === 'nft'}
        onClick={() => onChange('nft')}
      >
        NFT-сборка
      </button>
      <button
        className={tab === 'original' ? 'active' : ''}
        type="button"
        role="tab"
        aria-selected={tab === 'original'}
        onClick={() => onChange('original')}
      >
        Обычный подарок
      </button>
    </div>
  )
}
