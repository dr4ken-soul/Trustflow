import { Router } from 'express'
import multer from 'multer'
import crypto from 'crypto'
import db from './db.js'
import { uploadFile, getSignedUrl } from './services/ossService.js'
import { extractDocument, verifyExtractedData, reconcilePayment, extractInvoice } from './services/qwenService.js'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
})

function genId(prefix) {
  return `${prefix}-${crypto.randomBytes(6).toString('hex')}`
}

/**
 * create a new client
 */
router.post('/clients', (req, res) => {
  const { name } = req.body
  if (!name) return res.status(400).json({ error: 'name is required' })
  const id = genId('cli')
  db.prepare('insert into clients (id, name) values (?, ?)').run(id, name)
  const client = db.prepare('select * from clients where id = ?').get(id)
  res.json(client)
})

/**
 * list all clients
 */
router.get('/clients', (req, res) => {
  const clients = db.prepare('select * from clients order by created_at desc').all()
  res.json(clients)
})

/**
 * upload a document and run qwen vl extraction plus qwen max verification
 * this is the core onboarding flow
 */
router.post('/clients/:clientId/upload', upload.single('file'), async (req, res) => {
  const { clientId } = req.params
  const { type = 'id' } = req.body

  const client = db.prepare('select * from clients where id = ?').get(clientId)
  if (!client) return res.status(404).json({ error: 'client not found' })
  if (!req.file) return res.status(400).json({ error: 'file is required' })

  try {
    const { key } = await uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype)
    const signedUrl = await getSignedUrl(key, 3600)

    const extracted = await extractDocument(signedUrl, type)
    const verification = await verifyExtractedData(extracted, type)

    const docId = genId('doc')
    db.prepare(
      'insert into documents (id, client_id, file_url, type, extracted_data) values (?, ?, ?, ?, ?)'
    ).run(docId, clientId, key, type, JSON.stringify({ extracted, verification }))

    if (verification.status === 'approved') {
      db.prepare('update clients set status = ? where id = ?').run('active', clientId)
    } else {
      db.prepare('update clients set status = ? where id = ?').run('escalated', clientId)
      db.prepare(
        'insert into escalations (id, client_id, reason, agent_context) values (?, ?, ?, ?)'
      ).run(
        genId('esc'),
        clientId,
        verification.reason,
        JSON.stringify({ confidence: verification.confidence, ...extracted })
      )
    }

    res.json({ extracted, verification, document_id: docId })
  } catch (err) {
    console.error('upload and verify error', err.message)
    res.status(500).json({ error: err.message })
  }
})

/**
 * receive a payment webhook and reconcile against an invoice
 */
router.post('/payments/webhook', async (req, res) => {
  const { amount, source, client_id, invoice_id } = req.body

  if (!amount || !source || !client_id || !invoice_id) {
    return res.status(400).json({ error: 'amount source client_id and invoice_id are required' })
  }

  const client = db.prepare('select * from clients where id = ?').get(client_id)
  if (!client) return res.status(404).json({ error: 'client not found' })

  const invoice = db.prepare('select * from invoices where id = ?').get(invoice_id)
  if (!invoice) return res.status(404).json({ error: 'invoice not found' })

  try {
    const result = await reconcilePayment(
      { amount, source, client_id },
      { amount: invoice.amount, id: invoice.id, client_id: invoice.client_id }
    )

    const paymentId = genId('pay')
    db.prepare(
      'insert into payments (id, client_id, invoice_id, amount, source, status, summary) values (?, ?, ?, ?, ?, ?, ?)'
    ).run(
      paymentId,
      client_id,
      invoice_id,
      amount,
      source,
      result.status,
      result.summary || result.reason
    )

    if (result.status === 'matched') {
      db.prepare('update invoices set status = ? where id = ?').run('settled', invoice_id)
    } else {
      db.prepare(
        'insert into escalations (id, client_id, reason, agent_context) values (?, ?, ?, ?)'
      ).run(
        genId('esc'),
        client_id,
        result.reason,
        JSON.stringify({ paid: amount, expected: invoice.amount, invoice_id, source })
      )
    }

    res.json({
      payment_id: paymentId,
      status: result.status,
      summary: result.summary,
      reason: result.reason
    })
  } catch (err) {
    console.error('payment webhook error', err.message)
    res.status(500).json({ error: err.message })
  }
})

/**
 * list all payments with client names joined
 */
router.get('/payments', (req, res) => {
  const payments = db.prepare(`
    select p.*, c.name as client_name
    from payments p
    join clients c on p.client_id = c.id
    order by p.created_at desc
  `).all()
  res.json(payments)
})

/**
 * list all escalations with client names joined
 */
router.get('/escalations', (req, res) => {
  const escalations = db.prepare(`
    select e.*, c.name as client_name
    from escalations e
    join clients c on e.client_id = c.id
    order by e.created_at desc
  `).all()

  res.json(
    escalations.map((e) => ({
      ...e,
      agent_context: e.agent_context ? JSON.parse(e.agent_context) : null
    }))
  )
})

/**
 * submit a reviewer decision on an escalation
 */
router.post('/escalations/:id/review', (req, res) => {
  const { id } = req.params
  const { decision } = req.body

  if (!['approve', 'reject'].includes(decision)) {
    return res.status(400).json({ error: 'decision must be approve or reject' })
  }

  const escalation = db.prepare('select * from escalations where id = ?').get(id)
  if (!escalation) return res.status(404).json({ error: 'escalation not found' })

  db.prepare(
    'update escalations set status = ?, reviewer_decision = ? where id = ?'
  ).run('reviewed', decision, id)

  if (decision === 'approve') {
    db.prepare('update clients set status = ? where id = ?').run('active', escalation.client_id)
  }

  res.json({ id, status: 'reviewed', reviewer_decision: decision })
})

/**
 * seed the database with demo data for the dashboard and payments pages
 */
router.post('/seed', (req, res) => {
  const clients = [
    { id: 'cli-001', name: 'northwind trading', status: 'active' },
    { id: 'cli-002', name: 'cobalt studios', status: 'escalated' },
    { id: 'cli-003', name: 'meridian labs', status: 'active' },
    { id: 'cli-004', name: 'harbour line logistics', status: 'pending' }
  ]
  const insertClient = db.prepare(
    'insert or replace into clients (id, name, status) values (?, ?, ?)'
  )
  clients.forEach((c) => insertClient.run(c.id, c.name, c.status))

  const invoices = [
    { id: 'inv-101', client_id: 'cli-001', amount: 500, status: 'settled' },
    { id: 'inv-102', client_id: 'cli-002', amount: 500, status: 'outstanding' },
    { id: 'inv-103', client_id: 'cli-003', amount: 320, status: 'settled' },
    { id: 'inv-104', client_id: 'cli-001', amount: 1180, status: 'settled' }
  ]
  const insertInvoice = db.prepare(
    'insert or replace into invoices (id, client_id, amount, status) values (?, ?, ?, ?)'
  )
  invoices.forEach((i) => insertInvoice.run(i.id, i.client_id, i.amount, i.status))

  const payments = [
    { id: 'pay-001', client_id: 'cli-001', invoice_id: 'inv-101', amount: 500, source: 'crypto', status: 'matched', summary: 'payment of 500 from crypto matched invoice inv-101 exactly invoice has been marked settled' },
    { id: 'pay-002', client_id: 'cli-002', invoice_id: 'inv-102', amount: 450, source: 'bank', status: 'flagged', summary: 'payment of 450 did not match invoice amount of 500 difference flagged for human review' },
    { id: 'pay-003', client_id: 'cli-003', invoice_id: 'inv-103', amount: 320, source: 'crypto', status: 'matched', summary: 'payment of 320 from crypto matched invoice inv-103 exactly invoice has been marked settled' },
    { id: 'pay-004', client_id: 'cli-001', invoice_id: 'inv-104', amount: 1180, source: 'bank', status: 'matched', summary: 'payment of 1180 from bank matched invoice inv-104 exactly invoice has been marked settled' }
  ]
  const insertPayment = db.prepare(
    'insert or replace into payments (id, client_id, invoice_id, amount, source, status, summary) values (?, ?, ?, ?, ?, ?, ?)'
  )
  payments.forEach((p) =>
    insertPayment.run(p.id, p.client_id, p.invoice_id, p.amount, p.source, p.status, p.summary)
  )

  const escalations = [
    { id: 'esc-001', client_id: 'cli-002', reason: 'document number format mismatch suspected typo', context: '{"confidence":41,"field":"document_number","extracted_value":"ID-9920-1145-7"}' },
    { id: 'esc-002', client_id: 'cli-002', reason: 'payment amount mismatch invoice 500 paid 450', context: '{"paid":450,"expected":500,"source":"bank","invoice_id":"inv-102"}' },
    { id: 'esc-003', client_id: 'cli-004', reason: 'utility bill older than 3 months', context: '{"confidence":62,"field":"billing_period","extracted_value":"2026-02-01 to 2026-02-28"}' }
  ]
  const insertEsc = db.prepare(
    'insert or replace into escalations (id, client_id, reason, agent_context) values (?, ?, ?, ?)'
  )
  escalations.forEach((e) => insertEsc.run(e.id, e.client_id, e.reason, e.context))

  res.json({
    status: 'seeded',
    counts: {
      clients: clients.length,
      invoices: invoices.length,
      payments: payments.length,
      escalations: escalations.length
    }
  })
})

/**
 * upload an invoice image, extract financial details with qwen vl max
 * and create an invoice record using the extracted amount
 */
router.post('/invoices/upload', upload.single('file'), async (req, res) => {
  const { client_id } = req.body

  if (!client_id) return res.status(400).json({ error: 'client_id is required' })
  if (!req.file) return res.status(400).json({ error: 'file is required' })

  const client = db.prepare('select * from clients where id = ?').get(client_id)
  if (!client) return res.status(404).json({ error: 'client not found' })

  try {
    const { key } = await uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype)
    const signedUrl = await getSignedUrl(key, 3600)

    const extracted = await extractInvoice(signedUrl)

    const invoiceId = genId('inv')
    db.prepare(
      'insert into invoices (id, client_id, amount, due_date, invoice_number, vendor_name, extracted_data) values (?, ?, ?, ?, ?, ?, ?)'
    ).run(
      invoiceId,
      client_id,
      extracted.amount_due,
      extracted.due_date || null,
      extracted.invoice_number || null,
      extracted.vendor_name || null,
      JSON.stringify(extracted)
    )

    const invoice = db.prepare('select * from invoices where id = ?').get(invoiceId)
    res.json({ invoice, extracted })
  } catch (err) {
    console.error('invoice upload error', err.message)
    res.status(500).json({ error: err.message })
  }
})

/**
 * list all invoices
 */
router.get('/invoices', (req, res) => {
  const invoices = db.prepare(`
    select i.*, c.name as client_name
    from invoices i
    join clients c on i.client_id = c.id
    order by i.created_at desc
  `).all()
  res.json(invoices)
})

/**
 * create an invoice for a client
 */
router.post('/invoices', (req, res) => {
  const { client_id, amount, due_date } = req.body
  if (!client_id || !amount) {
    return res.status(400).json({ error: 'client_id and amount are required' })
  }
  const client = db.prepare('select * from clients where id = ?').get(client_id)
  if (!client) return res.status(404).json({ error: 'client not found' })

  const id = genId('inv')
  db.prepare(
    'insert into invoices (id, client_id, amount, due_date) values (?, ?, ?, ?)'
  ).run(id, client_id, amount, due_date || null)
  const invoice = db.prepare('select * from invoices where id = ?').get(id)
  res.json(invoice)
})

export default router
