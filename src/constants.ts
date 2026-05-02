import type { BackdropInfo } from './types'

export const API_BASE = 'https://api.changes.tg'
export const IMAGE_SIZE = 512
export const INITIAL_GIFT = 'Scared Cat'

export const fallbackBackdrop: BackdropInfo = {
  name: 'Предпросмотр',
  centerColor: 39167,
  edgeColor: 9625087,
  patternColor: 4289533,
  textColor: 16777215,
  rarityPermille: 0,
  hex: {
    centerColor: '#0098ff',
    edgeColor: '#92e4cb',
    patternColor: '#4177bd',
    textColor: '#ffffff',
  },
}
