// Log an error with contextual information to make debugging easier.
export function logError(context: string, error: unknown) {
  console.error(`${context}:`, error)
}

// Safely extract a user-facing message from an unknown error,
// falling back to a generic message if needed.
export function getErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return fallback
}
