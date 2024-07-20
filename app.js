import express from 'express'
import { configDotenv } from 'dotenv'
import cors from 'cors'
import setupSocket from './socket/socket.js'
import { connectDB } from './db/connection.js'
import cookieParser from 'cookie-parser'

configDotenv()
const app = express()

app.use(express.json())
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
}
app.use(cors(corsOptions))
app.use(cookieParser())

const PORT = process.env.PORT || 5000

// Import Routes
import authRouter from './routes/auth.routes.js'
import messageRouter from './routes/conversations.routes.js'
import userRouter from './routes/user.routes.js'

app.use('/api/auth', authRouter)
app.use('/api/conversations', messageRouter)
app.use('/api/users', userRouter)

// Set up Socket.IO
const { server } = setupSocket(app)

// Init app
server.listen(PORT, () => {
    connectDB()
    console.log(`Server listening on http://localhost:${PORT}`)
})
