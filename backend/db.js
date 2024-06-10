const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

let mongoServer

const startDatabase = async () => {
	mongoServer = await MongoMemoryServer.create()
	const mongoUri = mongoServer.getUri()

	await mongoose.connect(mongoUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})

	console.log('📦 Connected to MongoDB')
}

const stopDatabase = async () => {
	await mongoose.disconnect()
	await mongoServer.stop()
	console.log('📦 Disconnected from MongoDB')
}

const isConnected = () => {
	return mongoose.connection.readyState === 1
}

module.exports = { startDatabase, stopDatabase, isConnected }
