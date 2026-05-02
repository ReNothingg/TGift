import type { Trait, TraitSort } from '../types'

export function formatNumber(value?: number | null) {
  if (typeof value !== 'number') {
    return '...'
  }

  return new Intl.NumberFormat('ru-RU').format(value)
}

export function formatRarity(value?: number | null) {
  if (typeof value !== 'number') {
    return '...'
  }

  const fixed = value < 1 ? value.toFixed(2) : value.toFixed(1)
  return `${fixed.replace(/\.0$/, '')}%`
}

export function normalizeSearch(value: string) {
  return value.trim().toLocaleLowerCase()
}

export function getRarityTone(value?: number) {
  if (typeof value !== 'number') {
    return 'common'
  }

  if (value <= 0.25) return 'mythic'
  if (value <= 0.75) return 'legendary'
  if (value <= 1.5) return 'epic'
  if (value <= 3) return 'rare'
  return 'common'
}

export function sortTraits<T extends Trait>(items: T[], sort: TraitSort) {
  const sorted = [...items]

  if (sort === 'name') {
    sorted.sort((a, b) => a.name.localeCompare(b.name))
  } else {
    sorted.sort((a, b) => a.rarity - b.rarity || a.name.localeCompare(b.name))
  }

  return sorted
}

export function getRandomItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)]
}
