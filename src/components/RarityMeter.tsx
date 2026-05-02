import type { CSSProperties } from 'react'
import type { Trait } from '../types'
import { formatRarity } from '../utils/format'

export function RarityMeter({ model, backdrop, symbol }: { model?: Trait; backdrop?: Trait; symbol?: Trait }) {
  const traits = [
    { label: 'Модель', value: model?.rarity },
    { label: 'Фон', value: backdrop?.rarity },
    { label: 'Символ', value: symbol?.rarity },
  ]

  const rarest = traits.reduce(
    (min, trait) => (typeof trait.value === 'number' && trait.value < min ? trait.value : min),
    100,
  )
  const meter = Number.isFinite(rarest) ? Math.max(4, Math.min(96, 100 - rarest * 8)) : 40

  return (
    <div className="rarity-panel">
      <div className="rarity-ring" style={{ '--meter': `${meter}%` } as CSSProperties} aria-label="Интенсивность редкости">
        <strong>{formatRarity(rarest === 100 ? null : rarest)}</strong>
        <span>самый редкий слой</span>
      </div>
      <div className="rarity-list">
        {traits.map((trait) => (
          <div key={trait.label}>
            <span>{trait.label}</span>
            <strong>{formatRarity(trait.value)}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}
