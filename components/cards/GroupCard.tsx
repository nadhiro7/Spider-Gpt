'use client'
import { User } from "@/types"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

function GroupCard({
    _id,
    name,
    image,
    type
}: { name: string, image: string, type: string, _id: string }) {
    const path = usePathname()
    return (
        <Link className={`${path.includes(_id as string) && 'bg-[rgba(53,90,130,0.75)]'} p-2 hover:bg-dark-3 flex flex-row gap-4 items-center relative`} href={"/groups/" + _id} >
            <Image src={image} alt={"profile photo"} width={45} height={45} className="w-[50px] h-[50px] object-contain rounded-full" />
            <div>
                <h4 className='font-medium text-sm text-white'>{name}</h4>
            </div>
        </Link>
    )
}

export default GroupCard