'use server'
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
export async function createUser({ id,
    username,
    name,
    image,
    gender,
    birthday, email }: Params) {
    try {
        connectToDb();
        await User.create({
            id,
            username,
            name,
            image,
            gender,
            birthday,
            email
        })
    } catch (error: any) {
        throw new Error(`creating user is failed ${error.message}`)
    }
}
export async function updateUser({ id,
    username,
    name,
    image,
    gender,
    birthday, email }: Params) {
    try {
        console.log(username)
    } catch (error: any) {
        throw new Error(`creating user is failed ${error.message}`)
    }
}
