import { create } from 'zustand'
import type {
  Client,
  Invoice,
  Payment,
  Escalation,
  ActivityItem,
  ExtractedData,
  VerificationResult,
} from '../types'
import {
  getClients,
  getPayments,
  getEscalations,
  getInvoices,
  reviewEscalation as apiReviewEscalation,
  seedData,
} from '../lib/api'

interface AppState {
  clients: Client[]
  payments: Payment[]
  escalations: Escalation[]
  invoices: Invoice[]
  activity: ActivityItem[]

  uploadedFile: File | null
  isExtracting: boolean
  extractedData: ExtractedData | null
  verification: VerificationResult | null

  loading: boolean
  error: string | null

  setUploadedFile: (file: File | null) => void
  setExtracting: (val: boolean) => void
  setExtractedData: (data: ExtractedData | null) => void
  setVerification: (v: VerificationResult | null) => void
  resetOnboarding: () => void

  fetchAll: () => Promise<void>
  fetchInvoices: () => Promise<void>
  approveEscalation: (id: string) => Promise<void>
  rejectEscalation: (id: string) => Promise<void>
}

export const useAppStore = create<AppState>((set, get) => ({
  clients: [],
  payments: [],
  escalations: [],
  invoices: [],
  activity: [],

  uploadedFile: null,
  isExtracting: false,
  extractedData: null,
  verification: null,

  loading: false,
  error: null,

  setUploadedFile: (file) => set({ uploadedFile: file }),
  setExtracting: (val) => set({ isExtracting: val }),
  setExtractedData: (data) => set({ extractedData: data }),
  setVerification: (v) => set({ verification: v }),
  resetOnboarding: () =>
    set({
      uploadedFile: null,
      isExtracting: false,
      extractedData: null,
      verification: null,
    }),

  fetchAll: async () => {
    set({ loading: true, error: null })
    try {
      const [clients, payments, escalations, invoices] = await Promise.all([
        getClients(),
        getPayments(),
        getEscalations(),
        getInvoices(),
      ])

      const activity: ActivityItem[] = []

      payments.forEach((p: Payment) => {
        activity.push({
          id: `act-pay-${p.id}`,
          date: p.created_at,
          summary: p.summary || `${p.amount} via ${p.source} for ${p.client_name}`,
          status: p.status === 'matched' ? 'settled' : 'flagged',
        })
      })

      escalations.forEach((e: Escalation) => {
        activity.push({
          id: `act-esc-${e.id}`,
          date: e.created_at,
          summary: `${e.client_name} ${e.reason}`,
          status: e.status === 'reviewed' ? 'approved' : 'escalated',
        })
      })

      activity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      set({ clients, payments, escalations, invoices, activity, loading: false })
    } catch (err) {
      console.error('fetch all failed, trying seed', err)
      try {
        await seedData()
        const [clients, payments, escalations] = await Promise.all([
          getClients(),
          getPayments(),
          getEscalations(),
        ])

        const activity: ActivityItem[] = []
        payments.forEach((p: Payment) => {
          activity.push({
            id: `act-pay-${p.id}`,
            date: p.created_at,
            summary: p.summary || `${p.amount} via ${p.source} for ${p.client_name}`,
            status: p.status === 'matched' ? 'settled' : 'flagged',
          })
        })
        escalations.forEach((e: Escalation) => {
          activity.push({
            id: `act-esc-${e.id}`,
            date: e.created_at,
            summary: `${e.client_name} ${e.reason}`,
            status: e.status === 'reviewed' ? 'approved' : 'escalated',
          })
        })
        activity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        const invoices = await getInvoices()
        set({ clients, payments, escalations, invoices, activity, loading: false })
      } catch (seedErr) {
        console.error('seed also failed', seedErr)
        set({ error: 'failed to load data', loading: false })
      }
    }
  },

  /**
   * fetch just invoices and update the invoices slice of state
   */
  fetchInvoices: async () => {
    try {
      const invoices = await getInvoices()
      set({ invoices })
    } catch {
      // silent fail, invoices are non-critical
    }
  },

  approveEscalation: async (id: string) => {
    await apiReviewEscalation(id, 'approve')
    set((state) => ({
      escalations: state.escalations.map((e) =>
        e.id === id ? { ...e, status: 'reviewed', reviewer_decision: 'approve' as const } : e
      ),
    }))
  },

  rejectEscalation: async (id: string) => {
    await apiReviewEscalation(id, 'reject')
    set((state) => ({
      escalations: state.escalations.map((e) =>
        e.id === id ? { ...e, status: 'reviewed', reviewer_decision: 'reject' as const } : e
      ),
    }))
  },
}))
