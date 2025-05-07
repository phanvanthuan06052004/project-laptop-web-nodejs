import { env } from '~/config/environment'

export const MOMO_CONFIG = {
  PARTNER_CODE: env.MOMO_PARTNER_CODE,
  ACCESS_KEY: env.MOMO_ACCESS_KEY,
  SECRET_KEY: env.MOMO_SECRET_KEY,
  API_ENDPOINT: 'https://test-payment.momo.vn/v2/gateway/api',
  REDIRECT_URL: `${env.CLIENT_URL}/payment/result`,
  IPN_URL: `${env.API_URL}/v1/payments/momo-ipn`
}