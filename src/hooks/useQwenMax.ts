import { useState, useCallback } from 'react'
import { uploadDocument } from '../lib/api'
import type { VerificationResult } from '../types'

interface UseQwenMaxResult {
  verify: (clientId: string, file: File, type?: string) => Promise<VerificationResult | null>
  loading: boolean
  error: string | null
}

/**
 * useQwenMax
 * react hook wrapping the verification endpoint
 * the backend runs both qwen vl extraction and qwen max verification in one call
 * so this hook reuses the upload endpoint and returns just the verification result
 */
export function useQwenMax(): UseQwenMaxResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const verify = useCallback(
    async (clientId: string, file: File, type: string = 'id') => {
      setLoading(true)
      setError(null)
      try {
        const result = await uploadDocument(clientId, file, type)
        return result.verification as VerificationResult
      } catch (err) {
        const message = err instanceof Error ? err.message : 'verification failed'
        setError(message)
        return null
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { verify, loading, error }
}
