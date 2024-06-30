import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            index: 1,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: 1,
        },
        password: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            required: true,
            enum: ['male', 'female'],
            default: 'male',
        },
        avatar: {
            type: String,
            default: '',
        },
        contacts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                default: [],
            },
        ],
    },
    { timestamps: true },
)

const User = mongoose.model('User', userSchema)

export default User
