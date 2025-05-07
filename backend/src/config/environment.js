import 'dotenv/config'

export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  LOCAL_APP_HOST: process.env.LOCAL_APP_HOST,
  LOCAL_APP_PORT: process.env.LOCAL_APP_PORT,
  BUILD_MODE: process.env.BUILD_MODE,
  ACCESS_TOKEN_SECRET_SIGNATURE: process.env.ACCESS_TOKEN_SECRET_SIGNATURE,
  REFRESH_TOKEN_SECRET_SIGNATURE: process.env.REFRESH_TOKEN_SECRET_SIGNATURE,

  // cấu hình cho momo
  MOMO_PARTNER_CODE: process.env.MOMO_PARTNER_CODE,
  MOMO_ACCESS_KEY: process.env.MOMO_ACCESS_KEY,
  MOMO_SECRET_KEY: process.env.MOMO_SECRET_KEY,
  CLIENT_URL: process.env.CLIENT_URL,
  API_URL: process.env.API_URL
}
