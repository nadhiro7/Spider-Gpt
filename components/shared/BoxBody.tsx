'use client'
import { AddContact } from '@/lib/actions/contact.actions'
import { Add } from '@mui/icons-material'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Message from './Message'
import Reply from './Reply'
import { JoinToGroup } from '@/lib/actions/group.actions'
import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
interface Props {
    messages: Array<any>,
    isContact: boolean,
    currentUserId: string,
    contactUserId: string,
    type: string
}
function BoxBody({ messages, isContact, currentUserId, contactUserId, type }: Props) {
    const path = usePathname()

    const add = async () => {
        const contact = await AddContact(currentUserId, contactUserId, path)
        if (contact) {
            isContact = true
        }
    }
    const join = async () => {
        const member = await JoinToGroup(currentUserId, contactUserId, path)
        if (member) {
            isContact = true
        }
    }
    const [msgOpen, setMsgOpen] = useState<any>(false)
    function handleRpl(b: boolean) {
        setMsgOpen(b)
    }
    const router = useRouter()
    useEffect(() => {
        pusherClient.subscribe(toPusherKey(path))
        const functionHandler = () => { router.refresh() }
        pusherClient.bind('bind:messages', functionHandler)
        return () => {
            pusherClient.unsubscribe(toPusherKey(path))
            pusherClient.unbind('bind:messages', functionHandler)
        }
    }, []);
    return (
        <div className='flex h-[calc(100%-112px)] relative w-full overflow-hidden'>
            {type === 'user' ? (
                isContact ? (
                    <>
                        {messages.length > 0 ? (
                            <div id='box' className={`${msgOpen ? 'pb-14' : 'pb-3'} pt-3 w-full flex flex-end flex-col-reverse overflow-y-auto`}>
                                {
                                    messages.map(message => (
                                        <Message handleRpl={handleRpl} message={message} currentUserId={currentUserId} type={type} />
                                    ))
                                }
                                <Reply rpl={msgOpen} handleRpl={handleRpl} />
                            </div>
                        ) : (
                            <div className='flex self-center flex-col w-full h-max gap-2 items-center'>
                                <p className='self-center bg-dark-3 p-2 rounded-full text-white text-xs'>No messages to show, Send your first message</p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className='flex self-center flex-col w-full h-max gap-2 items-center'>
                        <p className='self-center bg-dark-3 p-2 rounded-full text-white text-xs'>Add this user to start conversation</p>
                        <button onClick={() => add()} className='bg-primary-500 rounded-full text-white text-xs px-3'>
                            <Add />
                            Add User
                        </button>
                    </div>
                )
            ) : (
                isContact ? (
                    <>
                        {messages.length > 0 ? (
                            <div id='box' className={`${msgOpen ? 'pb-14' : 'pb-3'} pt-3 w-full flex flex-end flex-col-reverse overflow-y-auto`}>
                                {
                                    messages.map(message => (
                                        <Message handleRpl={handleRpl} message={message} currentUserId={currentUserId} type={type} />
                                    ))
                                }
                                <Reply rpl={msgOpen} handleRpl={handleRpl} />
                            </div>
                        ) : (
                            <div className='flex self-center flex-col w-full h-max gap-2 items-center'>
                                <p className='self-center bg-dark-3 p-2 rounded-full text-white text-xs'>No messages to show, Send your first message</p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className='flex self-center flex-col w-full h-max gap-2 items-center'>
                        <p className='self-center bg-dark-3 p-2 rounded-full text-white text-xs'>Join to start conversation</p>
                        <button onClick={() => join()} className='bg-primary-500 rounded-full text-white text-xs px-3'>
                            <Add />
                            Join
                        </button>
                    </div>
                )
            )}

        </div>
    )
}

export default BoxBody