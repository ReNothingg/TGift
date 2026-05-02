import { fallbackBackdrop } from '../constants'
import type { BackdropInfo, BackdropTrait, GiftDetail } from '../types'

export function backdropToInfo(backdrop?: BackdropTrait | null): BackdropInfo | null {
  if (!backdrop?.hex) return null

  return {
    name: backdrop.name,
    centerColor: backdrop.centerColor ?? fallbackBackdrop.centerColor,
    edgeColor: backdrop.edgeColor ?? fallbackBackdrop.edgeColor,
    patternColor: backdrop.patternColor ?? fallbackBackdrop.patternColor,
    textColor: backdrop.textColor ?? fallbackBackdrop.textColor,
    rarityPermille: Math.round(backdrop.rarity * 10),
    hex: backdrop.hex,
  }
}

export function mergeBackdropInfo(detail: GiftDetail, backdropList: BackdropInfo[] | null): GiftDetail {
  if (!backdropList?.length) return detail

  const backdropInfoByName = new Map(backdropList.map((backdrop) => [backdrop.name, backdrop]))

  return {
    ...detail,
    backdrops: detail.backdrops.map((backdrop) => {
      const info = backdropInfoByName.get(backdrop.name)

      if (!info) return backdrop

      return {
        ...backdrop,
        centerColor: info.centerColor,
        edgeColor: info.edgeColor,
        patternColor: info.patternColor,
        textColor: info.textColor,
        hex: info.hex,
      }
    }),
  }
}
