import mongoose from 'mongoose'

let isConnected = false;

export async function connectToDb() {
    mongoose.set('strictQuery', true)

    if (!process.env.MONGO_URL) return console.log('url is not found');
    if (isConnected) return console.log('Already connected');

    try {
        await mongoose.connect(process.env.MONGO_URL);
        isConnected = true;
        console.log('Connected successful')
    } catch (error) {
        console.log(error)
    }
}