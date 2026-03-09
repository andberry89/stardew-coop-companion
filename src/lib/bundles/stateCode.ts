const STATE_SCHEMA_VERSION = 1

export type StateCodeEntry = {
  c?: boolean
  t?: number
}

export type StateCodePayload = {
  schema: number
  entries: Record<string, StateCodeEntry>
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

export async function parseStateCode(code: string): Promise<StateCodePayload> {
  let payload: StateCodePayload

  if (code.startsWith('SCC2:')) {
    const encoded = code.replace('SCC2:', '')
    const json = await gunzipString(encoded)
    payload = JSON.parse(json) as StateCodePayload
  } else if (code.startsWith('SCC1:')) {
    const encoded = code.replace('SCC1:', '')
    const json = atob(encoded)
    payload = JSON.parse(json) as StateCodePayload
  } else {
    throw new Error('Invalid state code')
  }

  if (payload.schema !== STATE_SCHEMA_VERSION) {
    throw new Error(`Unsupported state schema version: ${payload.schema}`)
  }

  if (typeof payload.entries !== 'object' || payload.entries === null) {
    throw new Error('Invalid state payload structure')
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
