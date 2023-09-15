'use client'
import { Group, User } from '@/types'
import React, { useState } from 'react'
import UserMenu from '../cards/UserMenu';
import Image from 'next/image';
import { ArrowBackIos } from '@mui/icons-material';
import UserInfo from '../cards/UserInfo';
function BoxHeader({ type, user, group, isJoin, currentUserId,
    contactUserId }: {
        type: string, user?: User, group?: Group, isJoin: boolean, currentUserId: string,
        contactUserId: string
    }) {
    const [open, setOpen] = useState<boolean>(false)
    const handleClose = () => {
        setOpen(!open)
    }
    return (
        <>
            <div className='flex h-16 w-full bg-dark-2 justify-between'>
                <button className='w-max text-left ml-1 px-4 flex flex-row items-center gap-3' onClick={handleClose}>
                    <Image src={type === 'user' ? user?.image ? user?.image : '' : group?.groupImage ? group?.groupImage : ''} className='rounded-full w-[45px] h-[45px] object-contain' alt={'profile picture'} height={45} width={45} />
                    <div>
                        {type === 'user' ? (
                            <>
                                <h4 className='font-medium text-sm text-white'>{user?.name}</h4>
                                <p className='text-xs text-gray-400'>{'@' + user?.username}</p>
                            </>
                        ) : (
                            <>
                                <h4 className='font-medium text-sm text-white'>{group?.groupName}</h4>
                            </>
                        )}
                    </div>
                </button>
                <UserMenu type={type} isJoin={isJoin} currentUserId={currentUserId} contactUserId={contactUserId} />

            </div>
            <UserInfo open={open} handleClose={handleClose} user={user} group={group} type={type} />
        </>
    )
}

export default BoxHeader