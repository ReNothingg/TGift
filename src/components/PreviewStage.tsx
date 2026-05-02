import type { CSSProperties } from 'react'
import { modelJsonUrl, originalJsonUrl, patternUrl, symbolJsonUrl } from '../api/changesApi'
import { fallbackBackdrop } from '../constants'
import type { BackdropInfo, Tab, Trait } from '../types'
import { Icon } from './Icon'
import { LottieAsset } from './LottieAsset'

export function PreviewStage({
  tab,
  gift,
  selectedModel,
  selectedSymbol,
  backdrop,
  zoom,
  isLoading,
}: {
  tab: Tab
  gift: string
  selectedModel?: Trait
  selectedSymbol?: Trait
  backdrop?: BackdropInfo | null
  zoom: number
  isLoading: boolean
}) {
  const activeBackdrop = backdrop ?? fallbackBackdrop
  const colors = activeBackdrop.hex ?? fallbackBackdrop.hex!
  const modelJson = gift && selectedModel ? modelJsonUrl(gift, selectedModel.name) : ''
  const patternImage = gift && selectedSymbol ? patternUrl(gift, selectedSymbol.name, 128) : ''
  const symbolJson = gift && selectedSymbol ? symbolJsonUrl(gift, selectedSymbol.name) : ''
  const originalJson = gift ? originalJsonUrl(gift) : ''

  return (
    <div className="preview-stage">
      <div
        className={`preview-art ${tab === 'original' ? 'plain' : ''} ${isLoading ? 'loading' : ''}`}
        style={
          {
            '--edge': colors.edgeColor,
            '--center': colors.centerColor,
            '--pattern': colors.patternColor,
            '--zoom': zoom,
            '--pattern-image': patternImage ? `url("${patternImage}")` : 'none',
          } as CSSProperties
        }
      >
        {tab === 'nft' ? (
          <>
            <div className="symbol-pattern-layer" />
            {symbolJson ? <LottieAsset className="symbol-watermark" src={symbolJson} /> : null}
            {modelJson ? (
              <LottieAsset className="main-gift" src={modelJson} ariaLabel={`${gift}, модель ${selectedModel?.name ?? ''}`} />
            ) : (
              <div className="image-placeholder">
                <Icon name="image" />
              </div>
            )}
          </>
        ) : originalJson ? (
          <LottieAsset className="original-gift" src={originalJson} ariaLabel={`${gift}, обычный подарок`} />
        ) : (
          <div className="image-placeholder">
            <Icon name="image" />
          </div>
        )}
      </div>
    </div>
  )
}
