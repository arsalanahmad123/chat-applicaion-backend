import { Server } from 'socket.io'
import http from 'http'

export default function setupSocket(app) {
    const server = http.createServer(app)
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST'],
        },
    })

    io.on('connection', (socket) => {
        console.log('A user connected')

        socket.on('message', (data) => {
            const { recipientId, message } = data
            io.to(recipientId).emit('message', message)
        })

        socket.on('disconnect', () => {
            console.log('User disconnected')
        })
    })

    return { server, io }
}
