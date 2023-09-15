import PusherServer from 'pusher'
import PusherClient from 'pusher-js'

export const pusherServer = new PusherServer({
    appId: process.env.PUSHER_API_ID || "1669267",
    key: process.env.PUSHER_KEY || "a534207d0fe250cd9aff",
    secret: process.env.PUSHER_SECRET || "f045f1e2242fbdeed047",
    cluster: 'eu',
    useTLS: true
})

export const pusherClient = new PusherClient(process.env.PUSHER_KEY || "a534207d0fe250cd9aff", { cluster: 'eu' })