'use client'
import { User } from "@/types"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

function UserCard({
    _id,
    id,
    name,
    image,
    username,
    email,
    bio,
    message,
    timestamp,
    session,
    type, searchText
}: User & { type: string, searchText: string }) {
    const path = usePathname()
    return (
        <Link className={`${path.includes(_id as string) && 'bg-[rgba(53,90,130,0.75)]'} p-2 hover:bg-dark-3 flex flex-row gap-4 items-center relative`} href={"/direct/" + _id} >
            <Image src={image} alt={"profile photo"} width={45} height={45} className="rounded-full" />
            {session && (
                <div className="absolute top-10 border-[2px] border-dark-2 left-10 w-3 h-3 bg-primary-500 rounded-full"></div>
            )}
            <div>
                <h4 className='font-medium text-sm text-white'>{name}</h4>
                <p className={`${path.includes(_id as string) && 'text-white'} text-xs text-gray-400`}>
                    {type === 'search' ? (
                        <>
                            <span className="text-primary-500">{'@' + searchText}</span>
                            {username.split(searchText)[1]}
                        </>
                    ) : (
                        type === '/' ? message : '@' + username
                    )}
                </p>
            </div>
            {timestamp && (
                <span className="text-[12px] text-gray-400 absolute right-2 top-3">
                    {
                        new Date(timestamp).toUTCString().slice(0, 16) === new Date().toUTCString().slice(0, 16)
                            ? new Date(timestamp).toUTCString().slice(16, 22) : new Date(timestamp).toUTCString().slice(0, 16)
                    }
                </span>
            )}
        </Link>
    )
}

export default UserCard