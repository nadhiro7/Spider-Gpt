'use client'

import { SendMessage } from "@/lib/actions/message.actions";
import { Send } from "@mui/icons-material";
import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { SendGroupMessage } from "@/lib/actions/group.actions";
import { SendBotMessage } from "@/lib/actions/bot.actions";
// import { pusherClient } from "@/lib/pusher";
// import { toPusherKey } from "@/lib/utils";

interface Props {
    currentUserId: string,
    contactUserId: string,
    type: string
}
function SendForm({ currentUserId, contactUserId, type }: Props) {
    const path = usePathname();
    const [text, setText] = useState<string>('')
    const send = async (e: FormEvent) => {
        e.preventDefault()
        const reply = JSON.parse(localStorage.getItem('replyMessage') as string)
        if (type === 'user') {
            const message = await SendMessage(currentUserId, contactUserId, text, path, reply ? reply?._id : '');
        } else {
            if (type === 'group') {
                const message = await SendGroupMessage(currentUserId, contactUserId, text, path, reply ? reply?._id : '');
            } else {
                await SendBotMessage(currentUserId, contactUserId, text, path, reply ? reply?._id : '');

            }
        }
        localStorage.removeItem('replyMessage')
        setText('')
    }
    return (

        <form onSubmit={send} className="flex flex-row w-full">
            <input value={text} onChange={(e) => { setText(e.target.value) }} className="no-focus w-full sendInput" placeholder="Write a message.." />
            <button type="submit" disabled={text ? false : true} className={`${text ? 'text-primary-500' : 'text-gray-500'} px-4`}>
                <Send fontSize='medium' />
            </button>
        </form>
    )
}

export default SendForm