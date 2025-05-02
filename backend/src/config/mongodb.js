import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from './environment'

let laptopDatabaseInstance = null

const mongoDBClient = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
}
)

export const CONNECT_DB = async () => {
  await mongoDBClient.connect()
  laptopDatabaseInstance = mongoDBClient.db(env.DATABASE_NAME)
}

export const CLOSE_DB = async () => {
  await mongoDBClient.close()
}

export const GET_DB = () => {
  if (!laptopDatabaseInstance)
    throw new Error('Database not connected')
  return laptopDatabaseInstance
}
