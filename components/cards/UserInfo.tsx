'use client'
import { getGroupMembers } from "@/lib/actions/group.actions"
import { Group, User } from "@/types"
import { Group as Persons, InfoOutlined } from "@mui/icons-material"
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
interface Props {
    open: boolean,
    handleClose: () => void,
    user?: User,
    group?: Group,
    type: string
}
function UserInfo({ open, handleClose, user, group, type }: Props) {
    const [members, setMembers] = useState<Array<any>>([])
    const path = usePathname()
    useEffect(() => {
        async function doSomething() {
            if (type === 'group') {
                const result = await getGroupMembers(group?._id as string, path)
                setMembers(JSON.parse(result))
                console.log(JSON.parse(result))
            }
        }
        doSomething()
    }, [])

    return (
        <div className="bg-dark-2">
            <Dialog open={open} onClose={handleClose}  >
                <DialogTitle sx={{ color: '#fff' }}>{type === 'user' ? 'User' : 'Group'} Info</DialogTitle>
                <DialogContent sx={{ p: '0px !important' }}>
                    <div className="flex flex-row items-center gap-5 w-[300px] p-5">
                        <Image
                            src={type === 'user' ? user?.image || '' : group?.groupImage || ''}
                            alt={"profile photo"}
                            width={60}
                            height={60}
                            className="rounded-full object-cover w-[70px] h-[70px] "
                        />
                        <div>
                            {type === 'user' ? (
                                <>
                                    <h4 className='font-medium text-sm text-white'>{user?.name}</h4>
                                    {user?.session === 'active' ? (
                                        <p className='text-xs text-primary-500'>Active</p>
                                    ) : (
                                        <p className='text-xs text-gray-400'>Inactive</p>
                                    )}
                                </>
                            ) : (
                                <>
                                    <h4 className='font-medium text-sm text-white'>{group?.groupName}</h4>
                                </>
                            )}
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
                    {type === 'group' && <div className="flex flex-col gap-5 w-[300px] ">
                        <div className="flex-row flex gap-2 text-gray-400 p-5">
                            <Persons />
                            <p>{members.length} Members</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <h4 className="text-gray-100 bg-dark-3 p-2 text-[13px]">Admin</h4>
                            <Link className={` p-5 hover:bg-dark-3 flex flex-row gap-4 items-center relative`} href={"/direct/" + group?.groupAdmin?._id} >
                                <Image src={group?.groupAdmin?.image || ''} alt={"profile photo"} width={45} height={45} className="rounded-full" />
                                <div>
                                    <h4 className='font-medium text-sm text-white'>{group?.groupAdmin?.name}</h4>
                                    <p className={` text-xs text-primary-500`}>
                                        {group?.groupAdmin?.username}
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
    )
}

export default UserInfo