import { modelUrl, patternUrl } from '../api/changesApi'
import { fallbackBackdrop } from '../constants'
import type { BackdropInfo, Trait } from '../types'
import { formatRarity } from '../utils/format'
import { Icon } from './Icon'

export function LayerStrip({
  gift,
  model,
  backdrop,
  symbol,
}: {
  gift: string
  model?: Trait
  backdrop?: BackdropInfo | null
  symbol?: Trait
}) {
  const backdropColors = backdrop?.hex ?? fallbackBackdrop.hex!

  return (
    <div className="layer-strip" aria-label="Выбранные слои NFT">
      <div className="layer-card">
        {gift && model ? <img src={modelUrl(gift, model.name, 128)} alt="" /> : <Icon name="image" />}
        <span>Модель</span>
        <strong>{model?.name ?? '...'}</strong>
        <small>{formatRarity(model?.rarity)}</small>
      </div>
      <div className="layer-card">
        <span
          className="backdrop-swatch large"
          style={{
            background: `radial-gradient(circle at 35% 30%, ${backdropColors.centerColor}, ${backdropColors.edgeColor})`,
          }}
        />
        <span>Фон</span>
        <strong>{backdrop?.name ?? '...'}</strong>
        <small>{formatRarity(typeof backdrop?.rarityPermille === 'number' ? backdrop.rarityPermille / 10 : null)}</small>
      </div>
      <div className="layer-card">
        {gift && symbol ? <img src={patternUrl(gift, symbol.name, 128)} alt="" /> : <Icon name="spark" />}
        <span>Символ</span>
        <strong>{symbol?.name ?? '...'}</strong>
        <small>{formatRarity(symbol?.rarity)}</small>
      </div>
    </div>
  )
}
