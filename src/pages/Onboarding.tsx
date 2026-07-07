import { useState, useRef, useCallback, useEffect } from 'react'
import { FadeIn } from '../components/ui/FadeIn'
import { useAppStore } from '../store/useAppStore'
import { createClient, uploadDocument } from '../lib/api'
import { Upload, FileText, CheckCircle, AlertTriangle, RefreshCw, AlertCircle } from 'lucide-react'
import type { DocumentType, ExtractedData, VerificationResult } from '../types'

const DOC_TYPES: { value: DocumentType; label: string }[] = [
  { value: 'id', label: 'id card' },
  { value: 'utility_bill', label: 'utility bill' },
  { value: 'bank_statement', label: 'bank statement' },
]

/**
 * Onboarding
 * drag and drop file upload with real qwen vl extraction and qwen max verification
 * uploads to oss then calls the backend which runs both models and returns the result
 */
export function Onboarding() {
  const {
    uploadedFile,
    isExtracting,
    extractedData,
    verification,
    setUploadedFile,
    setExtracting,
    setExtractedData,
    setVerification,
    resetOnboarding,
  } = useAppStore()

  const [docType, setDocType] = useState<DocumentType>('id')
  const [clientName, setClientName] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    async (file: File) => {
      if (!clientName.trim()) {
        setError('enter a client name first')
        return
      }

      setError(null)
      setUploadedFile(file)
      setExtracting(true)
      setExtractedData(null)
      setVerification(null)

      try {
        const client = await createClient(clientName.trim())
        const result = await uploadDocument(client.id, file, docType)

        setExtractedData(result.extracted as ExtractedData)
        setVerification(result.verification as VerificationResult)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'extraction failed'
        setError(message)
      } finally {
        setExtracting(false)
      }
    },
    [clientName, docType, setUploadedFile, setExtracting, setExtractedData, setVerification]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  useEffect(() => {
    if (clientName.trim()) setError(null)
  }, [clientName])

  return (
    <div className="pt-24 pb-16 px-6 lg:px-8 max-w-3xl mx-auto">
      <FadeIn>
        <h1
          className="font-display font-semibold text-3xl tracking-tight mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          onboarding
        </h1>
        <p
          className="font-body text-sm mb-10"
          style={{ color: 'var(--text-secondary)' }}
        >
          upload a client document and the agent extracts and verifies it with qwen vl and qwen max
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="mb-6">
          <label htmlFor="client-name" className="sr-only">
            client name
          </label>
          <input
            id="client-name"
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="client name"
            className="w-full liquid-glass rounded-xl px-4 py-3 font-body text-sm outline-none"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>
      </FadeIn>

      <FadeIn delay={0.15}>
        <div className="mb-6 flex gap-2">
          {DOC_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setDocType(t.value)}
              className="rounded-lg px-4 py-2 font-body text-sm transition-colors"
              style={{
                background:
                  docType === t.value ? 'rgba(200, 137, 95, 0.1)' : 'transparent',
                color: docType === t.value ? 'var(--accent)' : 'var(--text-secondary)',
                border: `1px solid ${docType === t.value ? 'var(--accent)' : 'var(--border-default)'}`,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </FadeIn>

      {error && (
        <FadeIn>
          <div
            className="liquid-glass-dark rounded-xl p-4 mb-6 flex items-center gap-3"
            style={{ color: 'var(--error)' }}
          >
            <AlertCircle size={16} />
            <span className="font-body text-sm">{error}</span>
          </div>
        </FadeIn>
      )}

      {!uploadedFile && (
        <FadeIn delay={0.2}>
          <label
            htmlFor="file-input"
            className="block border border-dashed rounded-2xl p-16 text-center cursor-pointer transition-colors"
            style={{
              borderColor: dragOver ? 'var(--accent)' : 'var(--border-default)',
              background: dragOver ? 'rgba(200, 137, 95, 0.04)' : 'transparent',
            }}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
          >
            <Upload
              size={24}
              style={{ color: 'var(--accent)' }}
              className="mx-auto mb-4"
            />
            <div
              className="font-body text-sm mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              drag and drop a document or click to browse
            </div>
            <div
              className="font-mono text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              png jpg or pdf up to 10mb
            </div>
            <input
              ref={inputRef}
              id="file-input"
              type="file"
              accept="image/*,application/pdf"
              onChange={onFileChange}
              className="sr-only"
            />
          </label>
        </FadeIn>
      )}

      {uploadedFile && isExtracting && (
        <FadeIn>
          <div className="liquid-glass rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText size={16} style={{ color: 'var(--accent)' }} />
              <span
                className="font-body text-sm"
                style={{ color: 'var(--text-primary)' }}
              >
                {uploadedFile.name}
              </span>
            </div>
            <div className="space-y-3">
              <div className="skeleton w-full h-4 rounded" />
              <div className="skeleton w-3/4 h-4 rounded" />
              <div className="skeleton w-1/2 h-4 rounded" />
            </div>
            <div
              className="font-mono text-xs mt-4"
              style={{ color: 'var(--text-muted)' }}
            >
              qwen-vl-max extracting fields then qwen-max verifying
            </div>
          </div>
        </FadeIn>
      )}

      {extractedData && verification && (
        <FadeIn>
          <div className="liquid-glass-dark rounded-2xl p-6 mb-6">
            <div
              className="font-mono text-xs tracking-widest uppercase mb-4"
              style={{ color: 'var(--accent-dim)' }}
            >
              extracted data
            </div>
            <pre
              className="font-mono text-sm whitespace-pre-wrap"
              style={{ color: 'var(--text-primary)' }}
            >
{JSON.stringify(extractedData, null, 2)}
            </pre>
          </div>

          <div className="liquid-glass rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div
                className="font-mono text-xs tracking-widest uppercase"
                style={{ color: 'var(--accent-dim)' }}
              >
                agent decision
              </div>
              <div className="flex items-center gap-2">
                {verification.status === 'approved' ? (
                  <CheckCircle size={16} style={{ color: 'var(--success)' }} />
                ) : (
                  <AlertTriangle size={16} style={{ color: 'var(--error)' }} />
                )}
                <span
                  className="font-mono text-sm"
                  style={{
                    color:
                      verification.status === 'approved'
                        ? 'var(--success)'
                        : 'var(--error)',
                  }}
                >
                  {verification.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div
                  className="font-mono text-xs mb-1"
                  style={{ color: 'var(--text-muted)' }}
                >
                  confidence
                </div>
                <div
                  className="font-display text-2xl font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {verification.confidence}
                  <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                    /100
                  </span>
                </div>
              </div>
              <div>
                <div
                  className="font-mono text-xs mb-1"
                  style={{ color: 'var(--text-muted)' }}
                >
                  model
                </div>
                <div
                  className="font-mono text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  qwen-max
                </div>
              </div>
            </div>

            <div
              className="font-body text-sm leading-relaxed pt-4"
              style={{
                color: 'var(--text-secondary)',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              {verification.reason}
            </div>
          </div>

          <button
            onClick={resetOnboarding}
            className="liquid-glass rounded-full px-5 py-2.5 font-body text-sm inline-flex items-center gap-2 transition-colors"
            style={{ color: 'var(--accent)' }}
          >
            <RefreshCw size={14} />
            upload another document
          </button>
        </FadeIn>
      )}
    </div>
  )
}

export default Onboarding
