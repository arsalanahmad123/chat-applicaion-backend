import User from '../models/user.model.js'

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password')

        res.status(200).json({ data: users })
    } catch (error) {
        console.error('Error in getAllUsers: ', error.message)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id

        const filteredUsers = await User.find({
            _id: { $ne: loggedInUserId },
        }).select('-password')

        res.status(200).json(filteredUsers)
    } catch (error) {
        console.error('Error in getUsersForSidebar: ', error.message)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const getContacts = async (req, res) => {
    try {
        const userId = req.user._id
        const user = await User.findById(userId).populate({
            path: 'contacts',
            select: ['-password', '-contacts'],
        })

        const contacts = user.contacts

        res.status(200).json({ data: contacts })
    } catch (error) {
        console.error('Error in getContacts: ', error.message)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const addContact = async (req, res) => {
    try {
        const loggedInUser = req.user
        const { email } = req.body
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ error: 'Invalid Contact' })
        }

        if (loggedInUser.contacts?.includes(user._id)) {
            return res.status(400).json({ error: 'Contact already exists' })
        }

        loggedInUser.contacts.push(user._id)

        await loggedInUser.save()

        res.status(200).json({ message: 'Contact added successfully' })
    } catch (error) {
        console.error('Error in addContact: ', error.message)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const deleteContact = async (req, res) => {
    try {
        const loggedInUser = req.user
        const id = req.params.id
        const user = await User.findById(id)

        if (!user) {
            return res.status(400).json({ error: 'Contact does not exist' })
        }

        if (loggedInUser.contacts?.includes(user._id)) {
            loggedInUser.contacts = loggedInUser.contacts.filter(
                (contactId) => contactId.toString() !== user._id.toString(),
            )
            await loggedInUser.save()
        }

        res.status(200).json({ message: 'Contact deleted successfully' })
    } catch (error) {
        console.error('Error in addContact: ', error.message)
        res.status(500).json({ error: 'Internal server error' })
    }
}
