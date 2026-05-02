export type Totals = {
  gifts: number
  models: number
  backdrops: number
  patterns: number
}

export type GiftMeta = {
  name: string
  id: string
  customEmojiId: string
}

export type Trait = {
  name: string
  rarity: number
}

export type BackdropInfo = {
  name: string
  centerColor: number
  edgeColor: number
  patternColor: number
  textColor: number
  rarityPermille: number
  hex?: {
    centerColor: string
    edgeColor: string
    patternColor: string
    textColor: string
  }
}

export type BackdropTrait = Trait & Partial<Omit<BackdropInfo, 'rarityPermille'>>

export type GiftDetail = {
  gift: GiftMeta
  models: Trait[]
  backdrops: BackdropTrait[]
  symbols: Trait[]
}

export type Tab = 'nft' | 'original'
export type TraitSort = 'rarity' | 'name'
export type CopyState = 'idle' | 'copied' | 'failed'
export type AssetPanel = 'models' | 'backdrops' | 'symbols'
