import express from 'express'
import {
    getMessages,
    sendMessage,
    getConversations,
} from '../controllers/conversations.controller.js'
import protectRoute from '../middleware/protectRoute.js'

const router = express.Router()

router.get('/', protectRoute, getConversations)
router.get('/:id', protectRoute, getMessages)
router.post('/send', protectRoute, sendMessage)

export default router
