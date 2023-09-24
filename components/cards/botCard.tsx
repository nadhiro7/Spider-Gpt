'use client'
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

function BotCard({
    _id,
    name,
    image,
    type, state
}: { name: string, image: string, type: string, _id: string, state: string }) {
    const path = usePathname()
    return (
        <Link className={`${path.includes(_id as string) && 'bg-[rgba(53,90,130,0.75)]'} p-2 hover:bg-dark-3 flex flex-row gap-4 items-center relative`} href={"/bots/" + _id} >
            <Image src={image} alt={"profile photo"} width={45} height={45} className="w-[50px] h-[50px] object-cover rounded-full" />
            <div>
                <h4 className='font-medium text-sm text-white'>{name}</h4>
                <p className={`${path.includes(_id as string) && 'text-white'} text-xs text-gray-400`}>#{state}</p>
            </div>
        </Link>
    )
}

export default BotCard