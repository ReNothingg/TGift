import { Icon } from './Icon'

export function EndpointRow({ label, value, onCopy }: { label: string; value: string; onCopy: (value: string) => void }) {
  return (
    <div className="endpoint-row">
      <span>{label}</span>
      <code title={value}>{value}</code>
      <button type="button" aria-label={`Скопировать ${label}`} onClick={() => onCopy(value)}>
        <Icon name="copy" />
      </button>
    </div>
  )
}
