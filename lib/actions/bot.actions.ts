'use server'
import { revalidatePath } from "next/cache";
import Bot from "../models/bot.model";
import BotMember from "../models/botMember.model";
import { connectToDb } from "../mongoose";
import User from "../models/user.model";
import BotMessage from "../models/botMessage.model";
import axios from 'axios'
import { Message } from "@/types";
import { pusherServer } from "../pusher";
import { toPusherKey } from "../utils";


export async function createBot(name: string, admin: string, image = '', path: string, type: string) {
    try {
        connectToDb();
        const newBot = await Bot.create({
            botName: name,
            botAdmin: admin,
            botImage: image,
            type: type,
            creationDate: new Date()
        })
        await BotMember.create({
            bot: newBot._id,
            user: admin,
            joinDate: new Date(),
        })
        revalidatePath(path)
        return newBot;
    } catch (error: any) {
        throw new Error('failed to create bot' + error.message)
    }
}

export async function searchBots(query: string, path: string) {
    try {
        connectToDb()
        const bots = await Bot.find({
            type: 'public',
            $or: [
                { groupName: { $regex: '^' + query, $options: 'i' } }, // Case-insensitive regex search for username
            ]
        });
        revalidatePath(path)
        return JSON.stringify(bots);
    } catch (error: any) {
        throw new Error('failed to create bot' + error.message)
    }
}

export async function getBots(id: string, path: string) {
    try {
        connectToDb()
        const bots = await BotMember.find({
            user: id
        }).populate('bot', '_id botName botImage type', Bot);
        console.log(bots)

        revalidatePath(path)
        return JSON.stringify(bots);
    } catch (error: any) {
        throw new Error('failed to create bot' + error.message)
    }
}

export async function JoinToBot(user: string | undefined, bot: string | undefined, path: string) {
    try {
        connectToDb()
        const member = await BotMember.create({
            user: user,
            bot: bot,
            joinDate: new Date()
        });
        revalidatePath(path)
        return member;
    } catch (error) {
        console.error('Error Add Contact:', error);
        throw error;
    }
}

export async function checkBot(botId: string, userId: string, path?: string) {
    try {
        connectToDb()
        const bot = await BotMember.findOne({
            bot: botId,
            user: userId
        })
        if (path) {
            revalidatePath(path)
        }
        return !!bot;
    } catch (error) {
        console.error('Error check bot:', error);
        throw error;
    }
}

export async function leaveBot(bot: string, user: string, path: string) {
    try {
        connectToDb()
        await BotMember.deleteOne({
            user: user,
            bot: bot
        }).populate('bot', '_id botName botImage', Bot);
        revalidatePath(path)
        return true;
    } catch (error) {
        console.error('Error get bot:', error);
        throw error;
    }
}
export async function getBot(botId: string, path?: string) {
    try {
        connectToDb()
        const bot = await Bot.findById(botId).populate('botAdmin', '_id image name username', User)
        if (path) {
            revalidatePath(path)
        }
        return JSON.stringify(bot);
    } catch (error) {
        console.error('Error get bot:', error);
        throw error;
    }
}
export async function getBotMembers(botId: string, path: string) {
    try {
        connectToDb()
        const bots = await BotMember.find({ bot: botId }).populate('user', '_id image name username', User)
        revalidatePath(path)
        return JSON.stringify(bots);
    } catch (error) {
        console.error('Error get bot:', error);
        throw error;
    }
} export async function SendBotMessage(sender: string | undefined, receiver: string | undefined, messageText: string, path: string, reply = '') {
    try {
        connectToDb()
        const message = await BotMessage.create({
            sender: sender,
            Bot: receiver,
            messageText: messageText,
            reply: reply ? reply : null,
            timestamp: new Date()
        });
        const options = {
            method: 'POST',
            url: 'https://chatgpt-api8.p.rapidapi.com/',
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': '52cd3a5570mshadd4d13cfac14cep1ed2efjsn8b96205e01cf',
                'X-RapidAPI-Host': 'chatgpt-api8.p.rapidapi.com'
            },
            data: [
                {
                    content: messageText,
                    role: 'user'
                }
            ]
        };
        const response = await axios.request(options);
        console.log(response.data);
        const messageBt = await BotMessage.create({
            sender: sender,
            Bot: receiver,
            messageText: response.data.text,
            reply: message._id,
            timestamp: new Date()
        });
        await pusherServer.trigger(toPusherKey(path),
            'bind:messages', {
            message: 'hello'
        })
        revalidatePath(path)
        return message;
    } catch (error) {
        console.error('Error Add Contact:', error);
        throw error;
    }
}
export async function getBotMessage(botId: string, path: string, pageNumber = 1, pageSize = 20) {
    try {
        connectToDb()
        const skipAmount = (pageNumber - 1) * pageSize;
        const messagesQuery = BotMessage.find({ Bot: botId })
            .sort({ timestamp: 'desc' }).skip(skipAmount)
            .populate({
                path: 'reply',
                model: BotMessage,
                select: '_id messageText sender',
                populate: {
                    path: 'sender',
                    model: User,
                    select: 'name'
                }
            })
            .populate('sender', '_id id username name image email bio', User)
            .populate('Bot', '_id botName botImage', Bot)
        const TotalMessagesCount = await BotMessage.countDocuments({
            Bot: botId,
        })
        let messages: Array<Message | any> | string = await messagesQuery.exec();
        const isNext = TotalMessagesCount > skipAmount + messages.length;
        messages = JSON.stringify(messages);
        revalidatePath(path)
        return { messages, isNext };
    } catch (error) {
        console.error('Error get group:', error);
        throw error;
    }
}
export async function deleteBotMessage(id: string, path: string) {
    try {
        connectToDb()
        await BotMessage.deleteOne({
            _id: id
        });
        await BotMessage.deleteOne({
            reply: id
        });
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
