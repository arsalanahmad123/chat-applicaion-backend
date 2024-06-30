import Conversation from '../models/conversation.model.js'
import Message from '../models/message.model.js'

import setupSocket from '../socket/socket.js'

const { io } = setupSocket()

export const getConversations = async (req, res) => {
    try {
        const id = req.user._id
        const conversations = await Conversation.find({
            participants: { $in: [id] },
        })
        res.status(200).json({ data: conversations })
    } catch (error) {
        console.log('Error in getConversations controller: ', error.message)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { message, receiverId } = req.body

        const senderId = req.user._id

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        })

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        })

        if (newMessage) {
            conversation.messages.push(newMessage._id)
        }

        await Promise.all([conversation.save(), newMessage.save()])

        io.to(receiverId).emit('message', newMessage)

        res.status(201).json(newMessage)
    } catch (error) {
        console.log('Error in sendMessage controller: ', error.message)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params
        const senderId = req.user._id

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate('messages')

        if (!conversation) return res.status(200).json([])

        const messages = conversation.messages

        res.status(200).json({ data: messages })
    } catch (error) {
        console.log('Error in getMessages controller: ', error.message)
        res.status(500).json({ error: 'Internal server error' })
    }
}