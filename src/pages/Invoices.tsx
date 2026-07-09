import { useState, useRef, useCallback, useEffect } from 'react'
import { FadeIn } from '../components/ui/FadeIn'
import { useAppStore } from '../store/useAppStore'
import { uploadInvoice } from '../lib/api'
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import type { ExtractedInvoice } from '../types'

/**
 * Invoices
 * select a client then upload an invoice image
 * qwen vl max extracts the financial fields and creates an invoice record
 * the created invoice becomes available for payment reconciliation
 */
export function Invoices() {
  const clients = useAppStore((s) => s.clients)
  const fetchAll = useAppStore((s) => s.fetchAll)
  const fetchInvoices = useAppStore((s) => s.fetchInvoices)

  const [clientId, setClientId] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [extracted, setExtracted] = useState<ExtractedInvoice | null>(null)
  const [invoiceId, setInvoiceId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  /**
   * handle a file being selected or dropped
   * uploads to oss then calls qwen vl to extract invoice fields
   * @param f - the file to process
   */
  const handleFile = useCallback(
    async (f: File) => {
      if (!clientId) {
        setError('select a client first')
        return
      }
      setError(null)
      setFile(f)
      setLoading(true)
      setExtracted(null)
      setInvoiceId(null)

      try {
        const result = await uploadInvoice(clientId, f)
        setExtracted(result.extracted as ExtractedInvoice)
        setInvoiceId(result.invoice.id)
        await fetchInvoices()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'extraction failed'
        setError(message)
      } finally {
        setLoading(false)
      }
    },
    [clientId, fetchInvoices]
  )

  /** reset all local state so the user can upload another invoice */
  const reset = () => {
    setFile(null)
    setExtracted(null)
    setInvoiceId(null)
    setError(null)
    setLoading(false)
  }

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const f = e.dataTransfer.files?.[0]
      if (f) handleFile(f)
    },
    [handleFile]
  )

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0]
      if (f) handleFile(f)
    },
    [handleFile]
  )

  return (
    <div className="pt-24 pb-16 px-6 lg:px-8 max-w-3xl mx-auto">
      <FadeIn>
        <h1
          className="font-display font-semibold text-3xl tracking-tight mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          invoices
        </h1>
        <p
          className="font-body text-sm mb-10"
          style={{ color: 'var(--text-secondary)' }}
        >
          upload an invoice image and qwen vl max extracts the financial details
          and creates an invoice record for reconciliation
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="mb-6">
          <label htmlFor="client-select" className="sr-only">
            select client
          </label>
          <select
            id="client-select"
            value={clientId}
            onChange={(e) => {
              setClientId(e.target.value)
              setError(null)
            }}
            className="w-full liquid-glass rounded-xl px-4 py-3 font-body text-sm outline-none"
            style={{
              color: clientId ? 'var(--text-primary)' : 'var(--text-muted)',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <option value="" disabled>
              select a client
            </option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
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

      {!file && (
        <FadeIn delay={0.2}>
          <label
            htmlFor="invoice-input"
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
              drag and drop an invoice image or click to browse
            </div>
            <div
              className="font-mono text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              png jpg or pdf up to 10mb
            </div>
            <input
              ref={inputRef}
              id="invoice-input"
              type="file"
              accept="image/*,application/pdf"
              onChange={onFileChange}
              className="sr-only"
            />
          </label>
        </FadeIn>
      )}

      {file && loading && (
        <FadeIn>
          <div className="liquid-glass rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText size={16} style={{ color: 'var(--accent)' }} />
              <span
                className="font-body text-sm"
                style={{ color: 'var(--text-primary)' }}
              >
                {file.name}
              </span>
            </div>
            <div className="space-y-3">
              <div className="skeleton w-full h-4 rounded" />
              <div className="skeleton w-3/4 h-4 rounded" />
              <div className="skeleton w-1/2 h-4 rounded" />
              <div className="skeleton w-2/3 h-4 rounded" />
            </div>
            <div
              className="font-mono text-xs mt-4"
              style={{ color: 'var(--text-muted)' }}
            >
              qwen-vl-max reading invoice fields
            </div>
          </div>
        </FadeIn>
      )}

      {extracted && invoiceId && (
        <FadeIn>
          <div className="liquid-glass-dark rounded-2xl p-6 mb-4">
            <div
              className="font-mono text-xs tracking-widest uppercase mb-5"
              style={{ color: 'var(--accent-dim)' }}
            >
              extracted invoice data
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-5">
              {extracted.vendor_name && (
                <div>
                  <div className="font-mono text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                    vendor
                  </div>
                  <div className="font-body text-sm" style={{ color: 'var(--text-primary)' }}>
                    {extracted.vendor_name}
                  </div>
                </div>
              )}
              {extracted.invoice_number && (
                <div>
                  <div className="font-mono text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                    invoice number
                  </div>
                  <div className="font-mono text-sm" style={{ color: 'var(--text-primary)' }}>
                    {extracted.invoice_number}
                  </div>
                </div>
              )}
              {extracted.client_name && (
                <div>
                  <div className="font-mono text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                    billed to
                  </div>
                  <div className="font-body text-sm" style={{ color: 'var(--text-primary)' }}>
                    {extracted.client_name}
                  </div>
                </div>
              )}
              {extracted.due_date && (
                <div>
                  <div className="font-mono text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                    due date
                  </div>
                  <div className="font-mono text-sm" style={{ color: 'var(--text-primary)' }}>
                    {extracted.due_date}
                  </div>
                </div>
              )}
            </div>

            <div
              className="pt-4 mb-4"
              style={{ borderTop: '1px solid var(--border-subtle)' }}
            >
              <div className="font-mono text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                total due
              </div>
              <div
                className="font-display text-3xl font-bold"
                style={{ color: 'var(--accent)' }}
              >
                NGN {extracted.amount_due.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
              </div>
            </div>

            {extracted.line_items && extracted.line_items.length > 0 && (
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <div className="font-mono text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                  line items
                </div>
                <div className="space-y-2">
                  {extracted.line_items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="font-body text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {item.description}
                      </span>
                      <span className="font-mono text-xs" style={{ color: 'var(--text-primary)' }}>
                        NGN {Number(item.amount).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="liquid-glass rounded-2xl p-5 mb-6 flex items-center gap-3">
            <CheckCircle size={16} style={{ color: 'var(--success)' }} />
            <div>
              <div className="font-body text-sm" style={{ color: 'var(--text-primary)' }}>
                invoice created and ready for reconciliation
              </div>
              <div className="font-mono text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {invoiceId}
              </div>
            </div>
          </div>

          <button
            id="upload-another-invoice-btn"
            onClick={reset}
            className="liquid-glass rounded-full px-5 py-2.5 font-body text-sm inline-flex items-center gap-2 transition-colors"
            style={{ color: 'var(--accent)' }}
          >
            <RefreshCw size={14} />
            upload another invoice
          </button>
        </FadeIn>
      )}
    </div>
  )
}

export default Invoices
