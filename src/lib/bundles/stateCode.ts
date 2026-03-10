const STATE_SCHEMA_VERSION = 1

export type StateCodeEntry = {
  c?: boolean
  t?: number
}

export type StateCodePayload = {
  schema: number
  entries: Record<string, StateCodeEntry>
}

export class StateCodeError extends Error {
  code:
    | 'INVALID_FORMAT'
    | 'INVALID_ENCODING'
    | 'INVALID_JSON'
    | 'UNSUPPORTED_SCHEMA'
    | 'INVALID_STRUCTURE'

  constructor(
    code:
      | 'INVALID_FORMAT'
      | 'INVALID_ENCODING'
      | 'INVALID_JSON'
      | 'UNSUPPORTED_SCHEMA'
      | 'INVALID_STRUCTURE',
    message: string,
  ) {
    super(message)
    this.name = 'StateCodeError'
    this.code = code
  }
}

export async function gzipString(input: string): Promise<string> {
  const stream = new CompressionStream('gzip')
  const writer = stream.writable.getWriter()
  writer.write(new TextEncoder().encode(input))
  writer.close()

  const compressed = await new Response(stream.readable).arrayBuffer()
  return btoa(String.fromCharCode(...new Uint8Array(compressed)))
}

export async function gunzipString(base64: string): Promise<string> {
  const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0))
  const stream = new DecompressionStream('gzip')
  const writer = stream.writable.getWriter()
  writer.write(bytes)
  writer.close()

  const decompressed = await new Response(stream.readable).arrayBuffer()
  return new TextDecoder().decode(decompressed)
}

export function getStateCodeErrorMessage(error: unknown): string {
  if (error instanceof StateCodeError) {
    if (error.code === 'UNSUPPORTED_SCHEMA') {
      return 'Wrong version.'
    }
    return 'Invalid code.'
  }
  return 'Import failed.'
}

export async function parseStateCode(code: string): Promise<StateCodePayload> {
  const trimmedCode = code.trim()
  let json: string

  if (trimmedCode.startsWith('SCC2:')) {
    const encoded = trimmedCode.slice(5)

    try {
      json = await gunzipString(encoded)
    } catch {
      throw new StateCodeError('INVALID_ENCODING', 'Failed to decode SCC2 state code')
    }
  } else if (trimmedCode.startsWith('SCC1:')) {
    const encoded = trimmedCode.slice(5)

    try {
      json = atob(encoded)
    } catch {
      throw new StateCodeError('INVALID_ENCODING', 'Failed to decode SCC1 state code')
    }
  } else {
    throw new StateCodeError('INVALID_FORMAT', 'Invalid state code format')
  }

  let payload: StateCodePayload

  try {
    payload = JSON.parse(json) as StateCodePayload
  } catch {
    throw new StateCodeError('INVALID_JSON', 'State code does not contain valid JSON')
  }

  if (payload.schema !== STATE_SCHEMA_VERSION) {
    throw new StateCodeError(
      'UNSUPPORTED_SCHEMA',
      `Unsupported state schema version: ${payload.schema}`,
    )
  }

  if (typeof payload.entries !== 'object' || payload.entries === null) {
    throw new StateCodeError('INVALID_STRUCTURE', 'Invalid state payload structure')
  }

  return payload
}

export async function buildStateCode(entryCompletedById: Record<string, boolean>): Promise<string> {
  const payload: StateCodePayload = {
    schema: STATE_SCHEMA_VERSION,
    entries: Object.fromEntries(
      Object.entries(entryCompletedById).map(([key, value]) => [
        key,
        {
          c: value,
          t: Date.now(),
        },
      ]),
    ),
  }

  const json = JSON.stringify(payload)
  const compressed = await gzipString(json)

  return `SCC2:${compressed}`
}
