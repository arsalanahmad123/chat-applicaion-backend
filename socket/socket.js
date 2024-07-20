import { Server } from 'socket.io'
import http from 'http'

export default function setupSocket(app) {
    const server = http.createServer(app)
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            withCredentials: true 
        },
    })

    io.on('connection', (socket) => {
        console.log('A user connected')

        socket.on('join', (conversationId) => {
            socket.join(conversationId)
            console.log(`User joined room: ${conversationId}`)
        })

       // Listen for 'new_message' event to broadcast messages
        socket.on("newMessage", (data) => {
            io.to(data.conversationId).emit("new_message", data);
        });


        socket.on('leave', (conversationId) => {
            socket.leave(conversationId)
            console.log(`User left room: ${conversationId}`)
        })

        socket.on('disconnect', () => {
            console.log('User disconnected')
        })

    })

    return { server, io }
}
