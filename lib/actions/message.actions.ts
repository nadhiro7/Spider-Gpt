'use server'
import { revalidatePath } from "next/cache";
import Message from "../models/message.model";
import { connectToDb } from "../mongoose";
import { Message as MessageType } from "@/types";
import User from "../models/user.model";
import { pusherServer } from "../pusher";
import { toPusherKey } from "../utils";


export async function getUsersWithLastMessages(currentUser: string | undefined) {
    try {
        connectToDb()
        // Create an aggregation pipeline to group messages by the sender and retrieve the latest message for each sender
        const pipeline = [
            {
                $match: { sender: { $ne: currentUser } } // Exclude the current user's messages
            },
            {
                $sort: { timestamp: -1 } // Sort messages in descending order by timestamp
            },
            {
                $group: {
                    _id: '$sender',
                    lastMessage: { $first: '$$ROOT' } // Get the first (latest) message for each sender
                }
            },
            {
                $replaceRoot: { newRoot: '$lastMessage' } // Replace the root document with the latest message
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'sender',
                    foreignField: '_id',
                    as: 'sender'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'receiver',
                    foreignField: '_id',
                    as: 'receiver'
                }
            },
            {
                $unwind: '$sender'
            },
            {
                $unwind: '$receiver'
            }
        ];
        //@ts-ignore
        const lastMessages = await Message.aggregate(pipeline);

        return lastMessages;

    } catch (error) {
        console.error('Error fetching users with last messages:', error);
        throw error;
    }
}

export async function SendMessage(sender: string | undefined, receiver: string | undefined, messageText: string, path: string, reply = '') {
    try {
        connectToDb()
        const message = await Message.create({
            sender: sender,
            receiver: receiver,
            messageText: messageText,
            reply: reply ? reply : null,
            timestamp: new Date()
        });
        console.log(toPusherKey('/direct/' + sender))
        await pusherServer.trigger(toPusherKey('/direct/' + sender),
            'bind:messages', {
            message: 'hello'
        })
        await pusherServer.trigger(receiver!,
            'bind:messagesChat', {
            message: 'hello'
        })
        revalidatePath(path)

        return message;
    } catch (error) {
        console.error('Error Add Contact:', error);
        throw error;
    }
}
export async function deleteMessage(id: string, path: string) {
    try {
        connectToDb()
        await Message.deleteOne({
            _id: id
        });
        // console.log(path)
        await pusherServer.trigger(id,
            'bind:messageDelete', {
            message: 'hello'
        })
        revalidatePath(path)
    } catch (error) {
        console.error('Error Delete Message:', error);
        throw error;
    }
}

export async function getMessages(sender: string | undefined, receiver: string | undefined, pageNumber = 1, pageSize = 20, path: string) {
    try {
        connectToDb()
        const skipAmount = (pageNumber - 1) * pageSize;
        const messagesQuery = Message.find({
            '$or': [
                {
                    sender: sender,
                    receiver: receiver
                },
                {
                    sender: receiver,
                    receiver: sender
                }
            ]
        }).sort({ timestamp: 'desc' }).skip(skipAmount).populate({
            path: 'reply',
            model: Message,
            select: '_id messageText sender',
            populate: {
                path: 'sender',
                model: User,
                select: 'name'
            }
        }).populate('sender', '_id id username name image email bio', User).populate('receiver', '_id id username name image email bio', User);
        const TotalMessagesCount = await Message.countDocuments({
            sender: sender,
            receiver: receiver
        })
        let messages: Array<MessageType | any> | string = await messagesQuery.exec();
        const isNext = TotalMessagesCount > skipAmount + messages.length;
        revalidatePath(path)
        messages = JSON.stringify(messages);

        return { messages, isNext };
    } catch (error) {
        console.error('Error Add Contact:', error);
        throw error;
    }
}