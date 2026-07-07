/**
 * qwen cloud configuration
 * central place for the qwen endpoint and model names
 * the frontend never calls qwen directly all calls go through the backend
 */

export const QWEN_ENDPOINT = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1'
export const QWEN_VL_MODEL = 'qwen-vl-max'
export const QWEN_MAX_MODEL = 'qwen-max'

export const qwenConfig = {
  endpoint: QWEN_ENDPOINT,
  vlModel: QWEN_VL_MODEL,
  maxModel: QWEN_MAX_MODEL,
} as const
