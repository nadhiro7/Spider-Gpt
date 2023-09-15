'use server'
import { use } from "react";
import Message from "../models/message.model";
import User from "../models/user.model";
import { connectToDb } from "../mongoose"

interface Params {
    id: string,
    username: string,
    name: string,
    image: string,
    gender: string,
    birthday: string,
    email: string
}
export async function createOrUpdateUser({ id,
    username,
    name,
    image,
    gender,
    birthday, email }: Params) {
    try {
        connectToDb();
        console.log(email)
        await User.findOneAndUpdate({ id: id }, {
            id,
            username,
            name,
            image,
            gender,
            birthday,
            email
        }, {
            upsert: true
        })
    } catch (error: any) {
        throw new Error(`creating user is failed ${error.message}`)
    }
}


export async function updateSession({ user_id,
    session,
    active_at }: { user_id: string, session: string, active_at: Date }) {
    try {
        console.log({
            id: user_id,
            session,
            active_at
        })
        connectToDb();
        await User.updateOne({ id: user_id }, {
            session,
            active_at
        })
    } catch (error: any) {
        throw new Error(`creating user is failed ${error.message}`)
    }
}


export async function deleteUser(id: string) {
    try {
        connectToDb();
        await User.findOneAndDelete({ id: id })
    } catch (error: any) {
        throw new Error(`creating user is failed ${error.message}`)
    }
}


export async function searchUsers(query: string, currentUserID: string | undefined) {
    try {
        connectToDb()
        const users = await User.find({
            id: { $ne: currentUserID },
            $or: [
                { username: { $regex: '^' + query, $options: 'i' } }, // Case-insensitive regex search for username
            ]
        });
        return JSON.stringify(users);
    } catch (error) {
        console.error('Error searching users:', error);
        throw error;
    }
}
export async function getUser(id: string | undefined, idTypeMongo: boolean) {
    try {
        connectToDb()
        let user
        idTypeMongo ? user = await User.findById(id) : user = await User.findOne({
            id: id
        })
        return JSON.stringify(user);
    } catch (error) {
        console.error('Error searching users:', error);
        throw error;
    }
}