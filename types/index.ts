export interface User {
    id: string,
    name: string,
    image: string,
    username: string,
    email: string,
    bio: string,
    _id?: string,
    message?: string,
    timestamp?: string,
    session?: string,
    active_at?: Date
}

export interface Message {
    _id: string,
    messageText: string,
    timestamp: string,
    reply?: {
        _id: string,
        messageText: string,
        sender: {
            name: string
        }
    },
    sender?: User,
    receiver?: User,

}
export interface Group {
    _id: string,
    groupName: string,
    groupImage: string,
    groupAdmin?: User
}