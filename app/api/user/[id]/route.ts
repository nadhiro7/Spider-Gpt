import User from "@/lib/models/user.model";
import { connectToDb } from "@/lib/mongoose";

interface Params{
    id: string
}
export async function GET(req: Request,{params}:{params: Params} ){
    
    try {
        await connectToDb()
        const user = await User.findOne({id: params.id})
        return new Response(JSON.stringify(user),{status: 200})
    } catch (error: any) {
        return new Response(`error${error.message}`,{status: 500})
    }
}