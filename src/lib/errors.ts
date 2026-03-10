export function logError(context: string, error: unknown) {
  console.error(`${context}:`, error)
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return fallback
}
