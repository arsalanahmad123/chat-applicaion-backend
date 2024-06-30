import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'
import generateTokenAndSetCookie from '../utils/generateToken.js'

export const signup = async (req, res) => {
    try {
        const { username, password, email, gender } = req.body

        const user = await User.findOne({
            email: req.body.email,
        })

        if (user) {
            return res
                .status(400)
                .json({ error: 'Username or email already exists' })
        }

        // HASH PASSWORD HERE
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // https://avatar-placeholder.iran.liara.run/

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

        const newUser = new User({
            username,
            password: hashedPassword,
            gender,
            email,
            avatar: gender === 'male' ? boyProfilePic : girlProfilePic,
        })

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save()

            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                avatar: newUser.avatar,
            })
        } else {
            res.status(400).json({ error: 'Invalid user data' })
        }
    } catch (error) {
        console.log('Error in signup controller', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user?.password || '',
        )

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: 'Invalid email or password' })
        }

        generateTokenAndSetCookie(user._id, res)

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
        })
    } catch (error) {
        console.log('Error in login controller', error.message)
        res.status(500).json({ error: error.message })
    }
}

export const logout = (req, res) => {
    try {
        res.clearCookie('jwt')
        res.status(200).json({ message: 'Logged out successfully' })
        console.log('Logged out user')
    } catch (error) {
        console.log('Error in logout controller', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}
