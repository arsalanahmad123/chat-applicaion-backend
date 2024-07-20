import Conversation from '../models/conversation.model.js'
import Message from '../models/message.model.js'

import setupSocket from '../socket/socket.js'

const { io } = setupSocket()

export const getConversationsForSideBar = async (req, res) => {
    try {
        const id = req.user._id;
        const conversations = await Conversation.find({
            participants: { $in: [id] },
        }).populate({
            path: 'participants',
            select: 'username email', 
            match: { _id: { $ne: id } }
        })

        res.status(200).json({ data: conversations });
    } catch (error) {
        console.log('Error in getConversations controller: ', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getSingleConversation = async(req,res) => {
    try {
        const loggedInUser = req.user._id
        const id = req.params.id 
        const conversation = await Conversation.findById(id).populate({
            path: 'participants',
            select: 'username email',
            match: {_id: {$ne: loggedInUser }}
        }).populate({
            path: 'messages',
            populate: { 
                path: 'receiver', select: 'username email' 
            },
        }).exec();

        return res.status(200).json({
            data: conversation
        })

    } catch (error) {
        console.log("Error while getting single conversation",error.message)
        return res.status(500).json({error: error.message})
    }
}


export const sendMessage = async (req, res) => {
    try {
        const { message, receiverId,conversationID } = req.body
        const senderId = req.user._id

        let isNewConversation = false;

        let conversation;
        if(conversationID){
            conversation = await Conversation.findOne({
                _id: conversationID
            })
        }


        if (!conversationID) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            })
            isNewConversation = true;
        }

        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            message,
            conversationId: conversationID
        })

        if (newMessage) {
            conversation.messages.push(newMessage._id)
        }

        await Promise.all([conversation.save(), newMessage.save()])

        res.status(201).json(newMessage)
    } catch (error) {
        console.log('Error in sendMessage controller: ', error.message)
        res.status(500).json({ error: error.message })
    }
}

export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        if (message.sender.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "You can't delete this message" });
        }

        await message.deleteOne();
        res.status(204).send(); 

    } catch (error) {
        console.error('Error in delete message controller:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}