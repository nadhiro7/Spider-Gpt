'use client'
import { sidebarLink } from '@/constants'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import React, { useState } from 'react'
import AddGroup from './AddGroup'
import { User } from '@clerk/nextjs/server'
import AddBot from './AddBot'

function Sidebar({ user, _id }: { user: User | null, _id: string }) {
    const [openGroup, setOpenGroup] = useState<boolean>(false)
    const handleClose = () => {
        setOpenGroup(!openGroup)
    }
    const [openBot, setOpenBot] = useState<boolean>(false)
    const handleCloseBot = () => {
        setOpenBot(!openBot)
    }
    return (
        <>
            <div id='sidebar' className='h-screen overflow-hidden absolute top-0 w-0 z-50 anime bg-dark-2'>
                <div className='w-full relative h-full flex flex-col '>
                    <div className='p-5  flex flex-row gap-4 items-center'>
                        <UserButton showName={false} />
                        <div>
                            <h4 className='font-medium text-sm text-white'>{user?.firstName + ' ' + user?.lastName}</h4>
                            <p className='text-xs text-gray-400'>{'@' + user?.username}</p>
                        </div>
                    </div>
                    <div className='w-full h-[1px] bg-dark-3' />
                    <div className='p-5 flex flex-col mt-5 gap-3'>
                        {sidebarLink.map(link => (
                            link.href === '' ?
                                link.name.includes('Group') ? (
                                    <div onClick={handleClose} key={link.name} className='text-sm font-light flex flex-row gap-3 mb-3 cursor-pointer text-white'>
                                        <link.icon />
                                        <p>{link.name}</p>
                                    </div>
                                ) : (
                                    <div onClick={handleCloseBot} key={link.name} className='text-sm font-light flex flex-row gap-3 mb-3 cursor-pointer text-white'>
                                        <link.icon />
                                        <p>{link.name}</p>
                                    </div>
                                )
                                :
                                <Link href={link.href} key={link.name} className='text-sm font-light flex flex-row gap-3 mb-3 text-white'>
                                    <link.icon />
                                    <p>{link.name}</p>
                                </Link>
                        ))}
                    </div>
                    <div className='w-full p-5 self-end bottom-0 absolute'>
                        <h4 className='text-gray-600 font-medium'>Spider Gpt</h4>
                        <p className='text-xs text-gray-600'>Version 1.0.0 <span>By Nadhiro77</span></p>
                    </div>
                </div>
            </div>
            <AddGroup open={openGroup} handleClose={handleClose} _id={_id} type={'Add'} />
            <AddBot open={openBot} handleClose={handleCloseBot} _id={_id} />
        </>
    )
}

export default Sidebar