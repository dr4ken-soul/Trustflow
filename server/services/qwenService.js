import axios from 'axios'

const QWEN_ENDPOINT = process.env.QWEN_ENDPOINT || 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1'
const QWEN_API_KEY = process.env.QWEN_API_KEY
const QWEN_VL_MODEL = process.env.QWEN_VL_MODEL || 'qwen-vl-max'
const QWEN_MAX_MODEL = process.env.QWEN_MAX_MODEL || 'qwen-max'

/**
 * extraction prompts per document type
 * each prompt asks qwen vl to return json only with specific fields
 */
const EXTRACTION_PROMPTS = {
  id: `extract the following fields from this id document and return as json only with no other text
fields: name, date_of_birth as yyyy-mm-dd, document_number, nationality, issue_date as yyyy-mm-dd
return exactly this format
{"name":"","date_of_birth":"","document_number":"","nationality":"","issue_date":""}`,

  utility_bill: `extract the following fields from this utility bill and return as json only with no other text
fields: name, address, billing_period, amount_due as number, provider
return exactly this format
{"name":"","address":"","billing_period":"","amount_due":0,"provider":""}`,

  bank_statement: `extract the following fields from this bank statement and return as json only with no other text
fields: name, account_number, statement_period, closing_balance as number, bank_name
return exactly this format
{"name":"","account_number":"","statement_period":"","closing_balance":0,"bank_name":""}`
}

/**
 * extract document fields using qwen vl max
 * takes a signed oss url and doc type, returns structured json
 */
export async function extractDocument(imageUrl, docType) {
  const prompt = EXTRACTION_PROMPTS[docType] || EXTRACTION_PROMPTS.id

  const response = await axios.post(
    `${QWEN_ENDPOINT}/chat/completions`,
    {
      model: QWEN_VL_MODEL,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: imageUrl } }
          ]
        }
      ]
    },
    {
      headers: {
        'Authorization': `Bearer ${QWEN_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000
    }
  )

  const content = response.data.choices[0].message.content
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('qwen vl returned no parseable json: ' + content)
  }
  return JSON.parse(jsonMatch[0])
}

/**
 * verify extracted data using qwen max
 * takes extracted json and doc type, returns confidence score and decision
 */
export async function verifyExtractedData(extracted, docType) {
  const prompt = `you are a verification agent for client onboarding at a financial services company

given the following extracted data from a ${docType} document, verify it against these rules

extracted data:
${JSON.stringify(extracted, null, 2)}

verification rules:
1 all required fields must be present and non empty
2 document numbers should look valid and match expected patterns
3 dates should be valid and not in the future
4 names should be complete not partial or truncated
5 amounts should be positive numbers where applicable

score confidence from 0 to 100 based on how complete and consistent the data is
if confidence is 80 or above return status approved
if confidence is below 80 return status escalated

return json only with exactly this format
{"confidence": 0, "status": "approved", "reason": "one or two sentences explaining the decision"}`

  const response = await axios.post(
    `${QWEN_ENDPOINT}/chat/completions`,
    {
      model: QWEN_MAX_MODEL,
      messages: [
        { role: 'user', content: prompt }
      ]
    },
    {
      headers: {
        'Authorization': `Bearer ${QWEN_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000
    }
  )

  const content = response.data.choices[0].message.content
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('qwen max returned no parseable json: ' + content)
  }
  const result = JSON.parse(jsonMatch[0])

  if (!result.confidence || !result.status || !result.reason) {
    throw new Error('qwen max returned incomplete verification: ' + content)
  }

  return result
}

/**
 * reconcile a payment against an invoice using qwen max
 * returns matched or flagged with a reason and summary
 */
export async function reconcilePayment(payment, invoice) {
  const prompt = `you are a payment reconciliation agent for a business that handles client invoices

given a payment and an invoice, determine if they match

payment:
${JSON.stringify(payment, null, 2)}

invoice:
${JSON.stringify(invoice, null, 2)}

reconciliation rules:
1 if payment amount equals invoice amount exactly return matched
2 if payment amount differs by less than 2 percent of the invoice amount return matched with a note about the small difference
3 if payment amount differs by more than 2 percent return flagged
4 if the payment has no matching invoice return flagged

return json only with exactly this format
{"status": "matched", "reason": "one sentence explanation", "summary": "one line summary for the activity feed"}`

  const response = await axios.post(
    `${QWEN_ENDPOINT}/chat/completions`,
    {
      model: QWEN_MAX_MODEL,
      messages: [
        { role: 'user', content: prompt }
      ]
    },
    {
      headers: {
        'Authorization': `Bearer ${QWEN_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000
    }
  )

  const content = response.data.choices[0].message.content
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('qwen max returned no parseable json: ' + content)
  }
  const result = JSON.parse(jsonMatch[0])

  if (!result.status || !result.reason) {
    throw new Error('qwen max returned incomplete reconciliation: ' + content)
  }

  return result
}
