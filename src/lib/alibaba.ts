/**
 * alibaba cloud configuration constants
 * the frontend never touches alibaba cloud directly these are reference values
 * for documentation and for any future client side oss presigned url flows
 */

export const ALIBABA_REGION = 'oss-cn-hangzhou'

export const alibabaConfig = {
  region: ALIBABA_REGION,
  ossEndpoint: `https://${ALIBABA_REGION}.aliyuncs.com`,
} as const
