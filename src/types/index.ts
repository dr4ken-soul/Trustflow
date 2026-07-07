/**
 * trustflow shared types
 * mirrors the database schema on the client side
 */

export type ClientStatus = 'pending' | 'active' | 'escalated'

export interface Client {
  id: string
  name: string
  status: ClientStatus
  created_at: string
}

export type DocumentType = 'id' | 'utility_bill' | 'bank_statement'

export interface ExtractedData {
  name?: string
  date_of_birth?: string
  document_number?: string
  nationality?: string
  issue_date?: string
  address?: string
  billing_period?: string
  amount_due?: number
  provider?: string
  account_number?: string
  statement_period?: string
  closing_balance?: number
  bank_name?: string
}

export interface VerificationResult {
  confidence: number
  status: 'approved' | 'escalated'
  reason: string
}

export interface Document {
  id: string
  client_id: string
  file_url: string
  type: DocumentType
  extracted_data: {
    extracted: ExtractedData
    verification: VerificationResult
  }
  created_at: string
}

export type InvoiceStatus = 'outstanding' | 'settled'

export interface Invoice {
  id: string
  client_id: string
  amount: number
  status: InvoiceStatus
  due_date: string
}

export type PaymentStatus = 'matched' | 'flagged'
export type PaymentSource = 'crypto' | 'bank'

export interface Payment {
  id: string
  client_id: string
  invoice_id: string
  amount: number
  source: PaymentSource
  status: PaymentStatus
  created_at: string
  client_name?: string
  summary?: string
}

export type EscalationStatus = 'pending' | 'reviewed'
export type ReviewerDecision = 'approve' | 'reject' | null

export interface Escalation {
  id: string
  client_id: string
  reason: string
  agent_context: Record<string, unknown>
  status: EscalationStatus
  reviewer_decision: ReviewerDecision
  created_at: string
  client_name?: string
}

export interface ActivityItem {
  id: string
  date: string
  summary: string
  status: 'approved' | 'flagged' | 'settled' | 'escalated'
}
