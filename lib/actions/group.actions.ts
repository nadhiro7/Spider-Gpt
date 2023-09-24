'use server'

import { revalidatePath } from "next/cache";
import Group from "../models/group.model";
import GroupMember from "../models/groupMember.model";
import GroupMessage from "../models/groupMessage.model";
import User from "../models/user.model";
import { connectToDb } from "../mongoose"
import { Message } from "@/types";
import { toPusherKey } from "../utils";
import { pusherServer } from "../pusher";


export async function createGroup(name: string, admin: string, image = '', path: string) {
    try {
        connectToDb();
        const newGroup = await Group.create({
            groupName: name,
            groupAdmin: admin,
            groupImage: image,
        })
        await GroupMember.create({
            group: newGroup._id,
            user: admin,
            joinDate: new Date(),
        })
        revalidatePath(path)
        return newGroup;
    } catch (error: any) {
        throw new Error('failed to create group' + error.message)
    }
}


export async function searchGroups(query: string, path: string) {
    try {
        connectToDb()
        const groups = await Group.find({
            $or: [
                { groupName: { $regex: '^' + query, $options: 'i' } }, // Case-insensitive regex search for username
            ]
        });
        revalidatePath(path)
        return JSON.stringify(groups);
    } catch (error) {
        console.error('Error searching groups:', error);
        throw error;
    }
}

export async function getGroups(id: string, path: string) {
    try {
        connectToDb()
        const groups = await GroupMember.find({
            user: id
        }).populate('group', '_id groupName groupImage', Group);
        revalidatePath(path)
        return JSON.stringify(groups);
    } catch (error) {
        console.error('Error get groups:', error);
        throw error;
    }
}
export async function leaveGroup(group: string, user: string, path: string) {
    try {
        connectToDb()
        await GroupMember.deleteOne({
            user: user,
            group: group
        }).populate('group', '_id groupName groupImage', Group);
        revalidatePath(path)
        return true;
    } catch (error) {
        console.error('Error get groups:', error);
        throw error;
    }
}
export async function checkGroup(groupId: string, userId: string, path?: string) {
    try {
        connectToDb()
        const group = await GroupMember.findOne({
            group: groupId,
            user: userId
        })
        if (path) {
            revalidatePath(path)
        }
        return !!group;
    } catch (error) {
        console.error('Error check group:', error);
        throw error;
    }
}

export async function getGroup(groupId: string, path?: string) {
    try {
        connectToDb()
        const group = await Group.findById(groupId).populate('groupAdmin', '_id image name username', User)
        if (path) {
            revalidatePath(path)
        }
        return JSON.stringify(group);
    } catch (error) {
        console.error('Error get group:', error);
        throw error;
    }
}
export async function getGroupMembers(groupId: string, path: string) {
    try {
        connectToDb()
        const groups = await GroupMember.find({ group: groupId }).populate('user', '_id image name username', User)
        revalidatePath(path)
        return JSON.stringify(groups);
    } catch (error) {
        console.error('Error get group:', error);
        throw error;
    }
}
export async function getGroupMessage(groupId: string, path: string, pageNumber = 1, pageSize = 20) {
    try {
        connectToDb()
        const skipAmount = (pageNumber - 1) * pageSize;
        const messagesQuery = GroupMessage.find({ group: groupId })
            .sort({ timestamp: 'desc' }).skip(skipAmount)
            .populate({
                path: 'reply',
                model: GroupMessage,
                select: '_id messageText sender',
                populate: {
                    path: 'sender',
                    model: User,
                    select: 'name'
                }
            })
            .populate('sender', '_id id username name image email bio', User)
        const TotalMessagesCount = await GroupMessage.countDocuments({
            group: groupId,
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

export async function SendGroupMessage(sender: string | undefined, receiver: string | undefined, messageText: string, path: string, reply = '') {
    try {
        connectToDb()
        const message = await GroupMessage.create({
            sender: sender,
            group: receiver,
            messageText: messageText,
            reply: reply ? reply : null,
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
export async function deleteGroupMessage(id: string, path: string) {
    try {
        connectToDb()
        await GroupMessage.deleteOne({
            _id: id
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
export async function deleteGroup(id: string, path: string) {
    try {
        connectToDb()
        await GroupMessage.deleteMany({
            group: id
        });
        await Group.deleteOne({
            _id: id
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
export async function JoinToGroup(user: string | undefined, group: string | undefined, path: string) {
    try {
        connectToDb()
        const member = await GroupMember.create({
            user: user,
            group: group,
            joinDate: new Date()
        });
        revalidatePath(path)
        return member;
    } catch (error) {
        console.error('Error Add Contact:', error);
        throw error;
    }
}
export async function updateGroup(name: string, path: string, image = '') {
    try {
        connectToDb();
        if (image === '') {
            const newGroup = await Group.updateOne({
                groupName: name,
            })
            revalidatePath(path)
            return newGroup;
        } else {
            const newGroup = await Group.updateOne({
                groupImage: image,
                groupName: name,
            })
            revalidatePath(path)
            return newGroup;
        }




    } catch (error: any) {
        throw new Error('failed to update group' + error.message)
    }
}
