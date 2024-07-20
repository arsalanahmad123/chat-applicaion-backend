import express from 'express'
import {
    // getMessages,
    sendMessage,
    getConversationsForSideBar,
    getSingleConversation,
    deleteMessage
} from '../controllers/conversations.controller.js'
import protectRoute from '../middleware/protectRoute.js'

const router = express.Router()

router.get('/', protectRoute, getConversationsForSideBar)
router.get('/:id', protectRoute, getSingleConversation)
router.post('/send', protectRoute, sendMessage)
router.delete('/deletemsg/:messageId',protectRoute,sendMessage)

export default router
