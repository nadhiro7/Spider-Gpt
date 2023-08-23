import Contact from "@/lib/models/contact.model";
import User from "@/lib/models/user.model";
import { connectToDb } from "@/lib/mongoose";
import mongoose from "mongoose";

interface Params{
    id: mongoose.Schema.Types.ObjectId
}
export async function GET(req: Request,{params}:{params: Params} ){
    
    try {
        await connectToDb()
        const contacts = await Contact.findOne({user: params.id})
        return new Response(JSON.stringify(contacts),{status: 200})
    } catch (error: any) {
        return new Response(`error${error.message}`,{status: 500})
    }
}