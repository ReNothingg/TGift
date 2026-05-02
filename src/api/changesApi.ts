import { API_BASE, IMAGE_SIZE } from '../constants'

function segment(value: string) {
  return encodeURIComponent(value)
}

export function apiUrl(path: string) {
  return `${API_BASE}${path}`
}

export function giftJsonUrl(gift: string) {
  return apiUrl(`/gift/${segment(gift)}`)
}

export function originalUrl(gift: string, size = IMAGE_SIZE) {
  return apiUrl(`/original/${segment(gift)}.png?size=${size}`)
}

export function originalJsonUrl(gift: string) {
  return apiUrl(`/original/${segment(gift)}.json`)
}

export function modelUrl(gift: string, model: string, size = IMAGE_SIZE) {
  return apiUrl(`/model/${segment(gift)}/${segment(model)}.png?size=${size}`)
}

export function modelJsonUrl(gift: string, model: string) {
  return apiUrl(`/model/${segment(gift)}/${segment(model)}.json`)
}

export function patternUrl(gift: string, symbol: string, size = IMAGE_SIZE) {
  return apiUrl(`/pattern/${segment(gift)}/${segment(symbol)}.png?size=${size}`)
}

export function symbolJsonUrl(gift: string, symbol: string) {
  return apiUrl(`/symbol/${segment(gift)}/${segment(symbol)}.json`)
}

export function backdropsUrl(gift: string) {
  return apiUrl(`/backdrops/${segment(gift)}?sorted`)
}

export function backdropInfoUrl(gift: string, backdrop: string) {
  return apiUrl(`/backdrop/${segment(gift)}/${segment(backdrop)}/info`)
}

export async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`)
  }

  return response.json() as Promise<T>
}
