'use client'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import { Variants, motion } from 'framer-motion'
import { ArrowBackIos, Close, DeleteOutline, Logout, PersonOutlined } from '@mui/icons-material';
import { deleteGroup, leaveGroup } from '@/lib/actions/group.actions';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { DeleteContact } from '@/lib/actions/contact.actions';
import { leaveBot } from '@/lib/actions/bot.actions';
import { User } from '@/types';
const itemVariants: Variants = {
    open: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    closed: { opacity: 0, y: 20, transition: { duration: 0.2 } }
};
function UserMenu({ type, isJoin, contactUserId, currentUserId, groupAdmin }: {
    type: string, isJoin: boolean, currentUserId: string,
    contactUserId: string, groupAdmin?: User
}) {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const path = usePathname()
    const router = useRouter()
    const leave = async () => {
        await leaveGroup(contactUserId, currentUserId, path)
    }
    const deleteGp = async () => {
        await deleteGroup(contactUserId, path)
        router.push('/groups')
    }
    const leaveBt = async () => {
        await leaveBot(contactUserId, currentUserId, path)
    }
    const deleteCnt = async () => {
        await DeleteContact(contactUserId, currentUserId, path)
    }
    const returnBack = async () => {
        router.back()
    }
    return (
        <>
            <motion.div className='text-gray-400 mr-2 self-center overflow-visible' >
                <button className='ml-2 md:hidden hover:text-white' onClick={returnBack}>
                    <ArrowBackIos />
                </button>
                {isJoin && (
                    <button onClick={() => setIsOpen(!isOpen)} className='hover:text-white'>
                        {isOpen ? (
                            <Close color='inherit' className='cursor-pointer' />
                        ) : (
                            <MoreVertIcon color='inherit' className='cursor-pointe' />
                        )}
                    </button>
                )}
                {isJoin && (<motion.ul
                    className='w-[150px] absolute right-2 top-14 rounded-[4px] shadow-inner  h-max bg-dark-2 z-50'
                    animate={isOpen ? "open" : "closed"}
                    variants={{
                        open: {

                            transition: {
                                type: "spring",
                                bounce: 0,
                                duration: 0.7,
                                delayChildren: 0.3,
                                staggerChildren: 0.05
                            }
                        },
                        closed: {

                            transition: {
                                type: "spring",
                                bounce: 0,
                                duration: 0.3
                            }
                        }
                    }}
                    style={{ pointerEvents: isOpen ? "auto" : "none", display: isOpen ? "block" : "none" }}
                >
                    {type === 'user' ? (<>

                        <motion.li variants={itemVariants}>
                            <button onClick={deleteCnt} className='text-red-700 text-sm justify-center font-light items-center flex flex-row w-full py-2 px-3 hover:bg-glassmorphism'>
                                <DeleteOutline fontSize='small' />
                                <p className='ml-4'>Delete chat</p>
                            </button>
                        </motion.li>
                    </>) : type === 'group' ? (
                        <>

                            <motion.li variants={itemVariants}>
                                <button onClick={groupAdmin?._id === currentUserId ? deleteGp : leave} className='text-red-700 text-sm justify-center font-light items-center flex flex-row w-full py-2 px-3 hover:bg-glassmorphism'>
                                    <Logout fontSize='small' />
                                    <p className='ml-4'>{groupAdmin?._id === currentUserId ? 'Delete' : 'Leave'} group</p>
                                </button>
                            </motion.li>

                        </>
                    ) : (
                        <>

                            <motion.li variants={itemVariants}>
                                <button onClick={leaveBt} className='text-red-700 text-sm justify-center font-light items-center flex flex-row w-full py-2 px-3 hover:bg-glassmorphism'>
                                    <Logout fontSize='small' />
                                    <p className='ml-4'>Leave bot</p>
                                </button>
                            </motion.li>

                        </>
                    )}
                </motion.ul>)}


            </motion.div>
        </>
    )
}

export default UserMenu