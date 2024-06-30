import express from 'express'
import protectRoute from '../middleware/protectRoute.js'
import {
    getUsersForSidebar,
    addContact,
    getContacts,
    getAllUsers,
    deleteContact,
} from '../controllers/users.controller.js'

const router = express.Router()

router.get('/', protectRoute, getUsersForSidebar)
router.post('/addcontact', protectRoute, addContact)
router.get('/contacts', protectRoute, getContacts)
router.get('/users', getAllUsers)
router.delete('/deletecontact/:id', protectRoute, deleteContact)

export default router
