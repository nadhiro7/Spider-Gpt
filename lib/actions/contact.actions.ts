'use server'

import { revalidatePath } from "next/cache";
import Contact from "../models/contact.model";
import { connectToDb } from "../mongoose";
import { model } from "mongoose";
import User from "../models/user.model";
import Message from "../models/message.model";

export async function isUserInContacts(userToCheck: string | undefined, currentUser: string | undefined, path?: string) {
    try {
        connectToDb()
        const contact = await Contact.findOne({
            user: currentUser,
            contactUser: userToCheck
        });
        if (path) {
            revalidatePath(path)
        }
        return !!contact;
    } catch (error) {
        console.error('Error searching users:', error);
        throw error;
    }
}
export async function getContact(currentUser: string | undefined, path: string) {
    try {
        connectToDb()
        const contacts = await Contact.find({
            user: currentUser,
        }).populate('contactUser', '_id id username name image email bio', User)
        revalidatePath(path)
        return JSON.stringify(contacts);
    } catch (error) {
        console.error('Error searching users:', error);
        throw error;
    }
}
export async function AddContact(userOne: string | undefined, userTwo: string | undefined, path: string) {
    try {
        connectToDb()
        const contact = await Contact.create({
            user: userOne,
            contactUser: userTwo,
            addedDate: new Date()
        });
        await Contact.create({
            user: userTwo,
            contactUser: userOne,
            addedDate: new Date()
        });
        revalidatePath(path)
        return contact;
    } catch (error) {
        console.error('Error Add Contact:', error);
        throw error;
    }
}

export async function DeleteContact(userOne: string | undefined, userTwo: string | undefined, path: string) {
    try {
        connectToDb()
        await Contact.deleteOne({
            user: userOne,
            contactUser: userTwo,
        });
        await Contact.deleteOne({
            user: userTwo,
            contactUser: userOne,
        });
        await Message.deleteMany({
            sender: userOne,
            receiver: userTwo
        })
        await Message.deleteMany({
            sender: userTwo,
            receiver: userOne
        })
        revalidatePath(path)
    } catch (error) {
        console.error('Error Add Contact:', error);
        throw error;
    }
}