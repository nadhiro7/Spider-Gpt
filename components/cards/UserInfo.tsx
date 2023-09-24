'use client'
import { getBotMembers } from "@/lib/actions/bot.actions"
import { getGroupMembers } from "@/lib/actions/group.actions"
import { Bot, Group, User } from "@/types"
import { Group as Persons, InfoOutlined, Edit } from "@mui/icons-material"
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import AddGroup from "../shared/AddGroup"
interface Props {
    open: boolean,
    handleClose: () => void,
    user?: User,
    group?: Group,
    bot?: Bot,
    type: string
}
function UserInfo({ open, handleClose, user, group, type, bot }: Props) {
    const [members, setMembers] = useState<Array<any>>([])
    const path = usePathname()
    useEffect(() => {
        async function doSomething() {
            if (type === 'group') {
                const result = await getGroupMembers(group?._id as string, path)
                setMembers(JSON.parse(result))
            } else {
                if (type === 'bot') {
                    const result = await getBotMembers(bot?._id as string, path)
                    setMembers(JSON.parse(result))
                }
            }
        }
        doSomething()
    }, [])
    const [openGroup, setOpenGroup] = useState<boolean>(false)
    const handleCloseEdit = () => {
        setOpenGroup(!openGroup)
    }
    return (
        <>
            <div className="bg-dark-2">
                <Dialog open={open} onClose={handleClose}  >
                    <DialogTitle sx={{ color: '#fff' }}>{type === 'user' ? 'User' : type === 'group' ? 'Group' : 'Bot'} Info</DialogTitle>
                    <DialogContent sx={{ p: '0px !important' }}>
                        <div className="flex flex-row items-center gap-5 w-[300px] p-5">
                            <Image
                                src={type === 'user' ? user?.image || '' : type === 'group' ? group?.groupImage || '' : bot?.botImage || ''}
                                alt={"profile photo"}
                                width={60}
                                height={60}
                                className="rounded-full object-cover w-[70px] h-[70px] "
                            />
                            <div className="flex flex-row gap-3">
                                {type === 'user' ? (
                                    <>
                                        <h4 className='font-medium text-sm text-white'>{user?.name}</h4>
                                        {user?.session === 'active' ? (
                                            <p className='text-xs text-primary-500'>Active</p>
                                        ) : (
                                            <p className='text-xs text-gray-400'>Inactive</p>
                                        )}
                                    </>
                                ) : type === 'group' ? (
                                    <>
                                        <h4 className='font-medium text-sm text-white'>{group?.groupName}</h4>
                                        <button className="text-light-1" onClick={handleCloseEdit}>
                                            <Edit fontSize="small" />
                                        </button>
                                    </>
                                ) :
                                    (
                                        <>
                                            <h4 className='font-medium text-sm text-white'>{bot?.botName}</h4>
                                            <p className='text-xs text-gray-400'>#{bot?.type}</p>
                                        </>
                                    )
                                }
                            </div>
                        </div>
                        <div className='w-full my-2 h-[4px] bg-dark-3' />
                        {type === 'user' && <div className="flex flex-row items-center text-gray-300 gap-5 w-[300px] p-5">
                            <InfoOutlined fontSize="large" color="inherit" />
                            <div className="flex flex-col gap-2">
                                {type === 'user' && user?.email && (
                                    <div>
                                        <h4 className='text-sm font-light mb-1 text-white'>{user?.email}</h4>
                                        <p className='text-xs text-gray-400'>Email</p>
                                    </div>
                                )}
                                {type === 'user' && user?.bio && (
                                    <div>
                                        <h4 className='text-sm font-light mb-1 text-white'>{user?.bio}</h4>
                                        <p className='text-xs text-gray-400'>bio</p>
                                    </div>
                                )}
                                {type === 'user' && (
                                    <div>
                                        <h4 className='text-sm font-light mb-1 text-primary-500'>{'@' + user?.username}</h4>
                                        <p className='text-xs text-gray-400'>Username</p>
                                    </div>
                                )}
                            </div>
                        </div>}
                        {(type === 'group' || type === 'bot') && <div className="flex flex-col gap-5 w-[300px] ">
                            <div className="flex-row flex gap-2 text-gray-400 p-5">
                                <Persons />
                                <p>{members.length} Members</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h4 className="text-gray-100 bg-dark-3 p-2 text-[13px]">Admin</h4>
                                <Link className={` p-5 hover:bg-dark-3 flex flex-row gap-4 items-center relative`} href={"/direct/" + type === 'group' ? group?.groupAdmin?._id || '' : bot?.botAdmin?._id || ''} >
                                    <Image src={type === 'group' ? group?.groupAdmin?.image || '' : bot?.botAdmin?.image || ''} alt={"profile photo"} width={45} height={45} className="rounded-full" />
                                    <div>
                                        <h4 className='font-medium text-sm text-white'>{type === 'group' ? group?.groupAdmin?.name : bot?.botAdmin?.name}</h4>
                                        <p className={` text-xs text-primary-500`}>
                                            {type === 'group' ? group?.groupAdmin?.username : bot?.botAdmin?.username}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h4 className="text-gray-100 bg-dark-3 p-2 text-[13px]">Members</h4>
                                {members.map(userMember => (
                                    userMember?.user?._id !== group?.groupAdmin?._id &&
                                    <Link className={` p-5 hover:bg-dark-3 flex flex-row gap-4 items-center relative`} href={"/direct/" + userMember?.user?._id} >
                                        <Image src={userMember?.user?.image || ''} alt={"profile photo"} width={45} height={45} className="rounded-full" />
                                        <div>
                                            <h4 className='font-medium text-sm text-white'>{userMember?.user?.name}</h4>
                                            <p className={` text-xs text-primary-500`}>
                                                {userMember?.user?.username}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>}

                    </DialogContent>
                    <DialogActions>
                    </DialogActions>
                </Dialog>
            </div>
            {type === 'group' && (
                <AddGroup open={openGroup} group={group} handleClose={handleCloseEdit} type={'Edit'} />
            )}
        </>
    )
}

export default UserInfo