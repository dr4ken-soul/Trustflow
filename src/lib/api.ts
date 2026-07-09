import axios from 'axios'

/**
 * trustflow api client for the frontend
 * in dev it uses the vite proxy which forwards /api to localhost:3001
 * in production it uses the vite api base url env var pointing to the ecs backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
})

/**
 * create a new client record
 * @param name
 */
export async function createClient(name: string) {
  const { data } = await api.post('/clients', { name })
  return data
}

/**
 * upload a document for a client and trigger extraction + verification
 * @param clientId
 * @param file
 * @param type
 */
export async function uploadDocument(
  clientId: string,
  file: File,
  type: string = 'id'
) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', type)
  const { data } = await api.post(`/clients/${clientId}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

/**
 * upload an invoice image for a client and trigger qwen vl extraction
 * @param clientId
 * @param file
 */
export async function uploadInvoice(clientId: string, file: File) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('client_id', clientId)
  const { data } = await api.post('/invoices/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

/**
 * submit a mock payment webhook
 * @param payload
 */
export async function submitPayment(payload: {
  amount: number
  source: string
  client_id: string
  invoice_id: string
}) {
  const { data } = await api.post('/payments/webhook', payload)
  return data
}

/**
 * fetch all escalations for the review queue
 */
export async function getEscalations() {
  const { data } = await api.get('/escalations')
  return data
}

/**
 * submit a reviewer decision on an escalation
 * @param id
 * @param decision
 */
export async function reviewEscalation(
  id: string,
  decision: 'approve' | 'reject'
) {
  const { data } = await api.post(`/escalations/${id}/review`, { decision })
  return data
}

/**
 * fetch all payments
 */
export async function getPayments() {
  const { data } = await api.get('/payments')
  return data
}

/**
 * fetch all clients
 */
export async function getClients() {
  const { data } = await api.get('/clients')
  return data
}

/**
 * seed the database with demo data
 */
export async function seedData() {
  const { data } = await api.post('/seed')
  return data
}

/**
 * fetch all invoices
 */
export async function getInvoices() {
  const { data } = await api.get('/invoices')
  return data
}

export default api
