import type { LocationQuery, LocationQueryRaw } from 'vue-router'

export type FlashType = 'success' | 'error'

export type FlashMessage = {
  type: FlashType
  message: string
}

// Safely extract a single string value from a router query parameter.
// Vue Router query params can be strings or string arrays.
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

// Attach a flash message to a route query so it can be displayed
// after navigation (for example after redirects).
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

// Read a flash message from the route query if one exists.
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

// Remove flash parameters from the query so the message is only shown once.
export function clearFlashQuery(query: LocationQuery): LocationQueryRaw {
  const next: LocationQueryRaw = { ...query }

  delete next.flash
  delete next.flashType

  return next
}
