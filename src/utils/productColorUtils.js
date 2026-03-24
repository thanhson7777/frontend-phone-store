const COLOR_HEX_MAP = {
  den: '#1a1a1a',
  black: '#1a1a1a',
  trang: '#F5F5F5',
  white: '#F5F5F5',
  'xanh duong': '#2196F3',
  blue: '#2196F3',
  do: '#E53935',
  red: '#E53935',
  vang: '#FFD700',
  gold: '#FFD700',
  yellow: '#FFD700',
  'xanh la': '#43A047',
  green: '#43A047',
  tim: '#9C27B0',
  purple: '#9C27B0',
  hong: '#E91E63',
  pink: '#E91E63',
  xam: '#757575',
  gray: '#757575',
  grey: '#757575',
  bac: '#C0C0C0',
  silver: '#C0C0C0',
  titan: '#8B8970'
}

export const normalizeText = (v) => (typeof v === 'string' ? v.trim() : '')

export const normalizeColorName = (name) => {
  const raw = normalizeText(name)
  if (!raw) return ''
  return raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/đ/g, 'd')
    .trim()
}

export const getColorHex = (colorName) => {
  const raw = normalizeText(colorName)
  if (!raw) return '#757575'

  // allow direct HEX input like "#ff0000"
  if (/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(raw)) return raw

  const normalized = normalizeColorName(raw)
  if (!normalized) return '#757575'

  if (COLOR_HEX_MAP[normalized]) return COLOR_HEX_MAP[normalized]

  // keyword match for names like "đen nhám", "xanh dương pastel", ...
  const rules = [
    { keys: ['den', 'black'], hex: '#1a1a1a' },
    { keys: ['trang', 'white'], hex: '#F5F5F5' },
    { keys: ['xanh duong', 'blue'], hex: '#2196F3' },
    { keys: ['do', 'red'], hex: '#E53935' },
    { keys: ['vang', 'gold', 'yellow'], hex: '#FFD700' },
    { keys: ['xanh la', 'green'], hex: '#43A047' },
    { keys: ['tim', 'purple'], hex: '#9C27B0' },
    { keys: ['hong', 'pink'], hex: '#E91E63' },
    { keys: ['xam', 'gray', 'grey'], hex: '#757575' },
    { keys: ['bac', 'silver'], hex: '#C0C0C0' },
    { keys: ['titan'], hex: '#8B8970' }
  ]
  const matched = rules.find(r => r.keys.some(k => normalized.includes(k)))
  if (matched) return matched.hex

  // stable fallback color derived from name
  let hash = 0
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash * 31 + normalized.charCodeAt(i)) >>> 0
  }
  const r = 80 + (hash & 0x7f)
  const g = 80 + ((hash >> 8) & 0x7f)
  const b = 80 + ((hash >> 16) & 0x7f)
  return `rgb(${r}, ${g}, ${b})`
}

export const extractVariantColor = (variant) => {
  if (!variant || typeof variant !== 'object') return ''
  return (
    normalizeText(variant.color) ||
    normalizeText(variant.mauSac) ||
    normalizeText(variant.colour) ||
    normalizeText(variant.colorName) ||
    normalizeText(variant.tenMau) ||
    normalizeText(variant?.attributes?.color) ||
    normalizeText(variant?.attributes?.mauSac) ||
    normalizeText(variant?.optionValues?.color)
  )
}

export const getProductColorSwatches = (product) => {
  const variants = Array.isArray(product?.variants) ? product.variants : []
  if (!variants.length) return []

  const map = new Map()
  for (const v of variants) {
    const name = extractVariantColor(v)
    if (!name) continue
    const key = normalizeColorName(name) || name
    if (!map.has(key)) {
      map.set(key, { name, hex: getColorHex(name) })
    }
  }
  return Array.from(map.values())
}

