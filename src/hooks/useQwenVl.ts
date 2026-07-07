import { useState, useCallback } from 'react'
import { uploadDocument } from '../lib/api'
import type { ExtractedData } from '../types'

interface UseQwenVlResult {
  extract: (clientId: string, file: File, type?: string) => Promise<ExtractedData | null>
  loading: boolean
  error: string | null
}

/**
 * useQwenVl
 * react hook wrapping the document upload and extraction endpoint
 * returns the extracted data loading state and any error
 */
export function useQwenVl(): UseQwenVlResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const extract = useCallback(
    async (clientId: string, file: File, type: string = 'id') => {
      setLoading(true)
      setError(null)
      try {
        const result = await uploadDocument(clientId, file, type)
        return result.extracted as ExtractedData
      } catch (err) {
        const message = err instanceof Error ? err.message : 'extraction failed'
        setError(message)
        return null
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { extract, loading, error }
}
