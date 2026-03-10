import type { LocationQuery, LocationQueryRaw } from 'vue-router'

export type FlashType = 'success' | 'error'

export type FlashMessage = {
  type: FlashType
  message: string
}

function getSingleQueryValue(value: LocationQuery[string] | undefined): string | null {
  if (typeof value === 'string' && value.trim()) {
    return value
  }

  if (Array.isArray(value)) {
    const first = value.find((entry) => typeof entry === 'string' && entry.trim())
    return typeof first === 'string' ? first : null
  }

  return null
}

export function buildFlashQuery(
  query: LocationQueryRaw = {},
  flash: FlashMessage,
): LocationQueryRaw {
  return {
    ...query,
    flash: flash.message,
    flashType: flash.type,
  }
}

export function readFlashQuery(query: LocationQuery): FlashMessage | null {
  const message = getSingleQueryValue(query.flash)
  if (!message) {
    return null
  }

  const rawType = getSingleQueryValue(query.flashType)
  const type: FlashType = rawType === 'error' ? 'error' : 'success'

  return {
    type,
    message,
  }
}

export function clearFlashQuery(query: LocationQuery): LocationQueryRaw {
  const next: LocationQueryRaw = { ...query }

  delete next.flash
  delete next.flashType

  return next
}
