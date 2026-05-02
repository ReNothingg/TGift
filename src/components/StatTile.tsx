import { formatNumber } from '../utils/format'

export function StatTile({ label, value }: { label: string; value?: number }) {
  return (
    <div className="stat-tile">
      <span>{label}</span>
      <strong>{formatNumber(value)}</strong>
    </div>
  )
}
