import OSS from 'ali-oss'
import crypto from 'crypto'

const client = new OSS({
  region: process.env.OSS_REGION || 'oss-ap-southeast-1',
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  bucket: process.env.OSS_BUCKET || 'trustflow-docs',
  secure: true
})

/**
 * upload a file buffer to oss under the documents prefix
 * returns the object key which we store in the database
 */
export async function uploadFile(buffer, filename, contentType) {
  const timestamp = Date.now()
  const random = crypto.randomBytes(4).toString('hex')
  const safeName = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
  const key = `documents/${timestamp}-${random}-${safeName}`

  const result = await client.put(key, buffer, {
    headers: { 'Content-Type': contentType }
  })

  return { key, url: result.url }
}

/**
 * generate a signed url for qwen vl to read a private oss object
 * expires after the given number of seconds, default 1 hour
 */
export async function getSignedUrl(key, expiresSeconds = 3600) {
  const url = client.signatureUrl(key, { expires: expiresSeconds })
  return url
}
