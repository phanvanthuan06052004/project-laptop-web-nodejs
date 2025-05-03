import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from './environment'

class DatabaseSingleton {
  constructor() {
    if (DatabaseSingleton.instance) {
      return DatabaseSingleton.instance
    }

    this.mongoClient = new MongoClient(env.MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    })
    
    this.dbInstance = null
    DatabaseSingleton.instance = this
  }

  static getInstance() {
    if (!DatabaseSingleton.instance) {
      DatabaseSingleton.instance = new DatabaseSingleton()
    }
    return DatabaseSingleton.instance
  }

  async connect() {
    if (!this.dbInstance) {
      await this.mongoClient.connect()
      this.dbInstance = this.mongoClient.db(env.DATABASE_NAME)
    }
    return this.dbInstance
  }

  async close() {
    if (this.mongoClient) {
      await this.mongoClient.close()
      this.dbInstance = null
    }
  }

  getDatabase() {
    if (!this.dbInstance) {
      throw new Error('Database not connected')
    }
    return this.dbInstance
  }
}

// Create single instance
const databaseInstance = DatabaseSingleton.getInstance()

// Export methods that use the singleton instance
export const CONNECT_DB = () => databaseInstance.connect()
export const CLOSE_DB = () => databaseInstance.close()
export const GET_DB = () => databaseInstance.getDatabase()
