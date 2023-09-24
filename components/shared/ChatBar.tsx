'use client'
import MenuIcon from '@mui/icons-material/Menu';
import SearchInput from '../forms/SearchInput';
import { useEffect, useState } from 'react';
import { searchUsers } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import UserCard from '../cards/UserCard';
import { Message, User } from '@/types';
import { usePathname, useRouter } from 'next/navigation';
import { getContact } from '@/lib/actions/contact.actions';
import { getUsersWithLastMessages } from '@/lib/actions/message.actions';
import { getGroups, searchGroups } from '@/lib/actions/group.actions';
import GroupCard from '../cards/GroupCard';
import { pusherClient } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import { getBots, searchBots } from '@/lib/actions/bot.actions';
import BotCard from '../cards/botCard';

function ChatBar({ id, _id }: { id: string | undefined, _id: string | undefined }) {
    const [users, setUsers] = useState<Array<User>>([])
    const [groups, setGroups] = useState<Array<any>>([])
    const [bots, setBots] = useState<Array<any>>([])
    const [contacts, setContacts] = useState<Array<User>>([])
    const [isSearch, setIsSearch] = useState<boolean>(false)
    const [text, setText] = useState<string>('')
    const openSideBar = () => {
        const portal = document.getElementById('portal')
        portal?.classList.contains('portal') ? portal?.classList.remove('portal') : portal?.classList.add('portal')
        const sidebar = document.getElementById('sidebar')
        sidebar?.classList.contains('sidebar') ? sidebar?.classList.remove('sidebar') : sidebar?.classList.add('sidebar')
    }
    const search = async (txt: string) => {
        if (txt) {
            if (path.includes('groups')) {
                setIsSearch(txt ? true : false)
                setText(txt)
                setGroups([])
                const result = await searchGroups(txt, path)
                setGroups(result ? JSON.parse(result) : [])
            } else {
                if (path.includes('bots')) {
                    setIsSearch(txt ? true : false)
                    setText(txt)
                    setBots([])
                    const result = await searchBots(txt, path)
                    setBots(result ? JSON.parse(result) : [])
                } else {
                    setIsSearch(txt ? true : false)
                    setText(txt)
                    setUsers([])
                    const result = await searchUsers(txt, id)
                    setUsers(result ? JSON.parse(result) : [])
                }
            }
        } else {
            setIsSearch(false)
            setUsers([])
            setGroups([])
            setBots([])
            setText('')
        }
    }
    const path = usePathname()
    useEffect(() => {
        const doSomething = async () => {
            if (path === '/contact') {
                setUsers([])
                setGroups([])
                setBots([])
                setIsSearch(false)
                setContacts([])
                const result = await getContact(_id, path)
                const resFin = result ? JSON.parse(result).map((item: any) => item.contactUser) : []
                setContacts(resFin)
            } else {
                if (path === '/') {
                    setContacts([])
                    setGroups([])
                    setBots([])
                    const result = await getUsersWithLastMessages(_id);
                    let msgs: Array<User> = [];
                    result.forEach(element => {
                        if (element.sender._id === _id) {
                            msgs.push({ ...element.receiver, message: element.messageText, timestamp: element.timestamp })
                        } else {
                            msgs.push({ ...element.sender, message: element.messageText, timestamp: element.timestamp })
                        }
                    });
                    let m: Array<User> = []
                    msgs.forEach(element => {
                        let y = false;
                        let msg: User;
                        msgs.forEach(e => {
                            if (element = e) {
                                y = true
                                msg = element
                            } else {
                                //@ts-ignore
                                if (element._id === e._id) {
                                    //@ts-ignore
                                    if (element.timestamp > e.timestamp) {
                                        y = true
                                        msg = element
                                    }
                                }
                            }
                        })
                        //@ts-ignore
                        if (y && !m.includes(msg)) {
                            m.push(element)
                        }
                    });
                    setContacts(m)
                } else {
                    if (path === '/groups') {
                        setContacts([])
                        setUsers([])
                        setBots([])
                        setIsSearch(false)
                        setGroups([])
                        const result = await getGroups(_id as string, path)
                        setGroups(result ? JSON.parse(result) : [])
                    } else {
                        if (path === '/bots') {
                            setContacts([])
                            setUsers([])
                            setGroups([])
                            setIsSearch(false)
                            setBots([])
                            const result = await getBots(_id as string, path)
                            setBots(result ? JSON.parse(result) : [])
                        }
                    }
                }
            }
        }
        doSomething()
    }, [path])
    const router = useRouter()
    useEffect(() => {
        pusherClient.subscribe(_id!)
        const functionHandler = async () => {
            const result = await getUsersWithLastMessages(_id);
            console.log(result)
        }
        pusherClient.bind('bind:messagesChat', functionHandler)
        return () => {
            pusherClient.unsubscribe(_id!)
            pusherClient.unbind('bind:messagesChat', functionHandler)
        }
    }, []);
    return (
        <section className={`bg-dark-2 max-md:w-full w-[400px] h-screen border-r-[1px]  border-dark-1 border-solid ${path.includes('direct') || path.includes('/groups/') ? 'max-md:hidden' : ''}`}>
            <div className='p-3 flex flex-row gap-3'>
                <button className='text-gray-400 hover:text-gray-100' onClick={openSideBar}>
                    <MenuIcon color='inherit' fontSize='medium' />
                </button>
                <SearchInput search={search} />
            </div>
            {
                isSearch && (
                    users.length > 0 ?
                        (<div>
                            <p className='py-2 px-4 text-gray-400 font-normal text-sm bg-dark-3'>Global Search Result</p>
                            {
                                users.map(user => (
                                    user.id !== id ? <UserCard _id={user._id} session={user.session} searchText={text} type='search' key={user.id} id={user.id} name={user.name} image={user.image} username={user.username} email={user.email} bio={user.bio} /> : null
                                ))
                            }
                        </div>) : (
                            groups.length > 0 ?
                                <div>
                                    <p className='py-2 px-4 text-gray-400 font-normal text-sm bg-dark-3'>Global Search Result</p>
                                    {
                                        groups.map(group => (
                                            <GroupCard _id={group._id} type='search' key={group._id} name={group.groupName} image={group.groupImage} />
                                        ))
                                    }
                                </div> : (
                                    bots.length > 0 &&
                                    <div>
                                        <p className='py-2 px-4 text-gray-400 font-normal text-sm bg-dark-3'>Global Search Result</p>
                                        {
                                            bots.map(bot => (
                                                <BotCard state={bot.type} _id={bot._id} type='search' key={bot._id} name={bot.botName} image={bot.botImage} />
                                            ))
                                        }
                                    </div>
                                )
                        )
                )
            }
            {
                contacts.length > 0 && !isSearch ? (
                    <div>
                        {
                            path === '/contact' || path === '/' ?
                                (
                                    <p className='py-2 px-4 text-gray-400 font-normal text-sm bg-dark-3'>{path === '/contact' ? 'Global Contacts' : path === '/' && 'Last messages'}</p>
                                )
                                : null
                        }
                        {
                            contacts.map(user => (
                                user.id !== id ? <UserCard _id={user._id} session={user.session} searchText={text} type={path} timestamp={user.timestamp && user.timestamp} message={user.message && user.message} key={user.id} id={user.id} name={user.name} image={user.image} username={user.username} email={user.email} bio={user.bio} /> : null
                            ))
                        }
                    </div>
                ) : (null)
            }
            {
                groups.length > 0 && !isSearch ? (
                    <div>
                        <p className='py-2 px-4 text-gray-400 font-normal text-sm bg-dark-3'>Global Groups</p>
                        {
                            groups.map(group => group.group?._id ? (
                                <GroupCard _id={group.group?._id} type={path} key={group.group?._id} name={group.group?.groupName} image={group.group?.groupImage} />
                            ) : (null))
                        }
                    </div>
                ) : (
                    bots.length > 0 && !isSearch &&
                    <div>
                        <p className='py-2 px-4 text-gray-400 font-normal text-sm bg-dark-3'>Global Bots</p>
                        {
                            bots.map(bot => (
                                <BotCard state={bot.bot?.type} _id={bot.bot?._id} type={path} key={bot.bot?._id} name={bot.bot?.botName} image={bot.bot?.botImage} />
                            ))
                        }
                    </div>
                )
            }
        </section>
    )
}

export default ChatBar