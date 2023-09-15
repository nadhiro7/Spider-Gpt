import { Close, Reply as Rep } from '@mui/icons-material'
import React, { useEffect, useState } from 'react'

function Reply({ rpl, handleRpl }: { rpl: boolean, handleRpl: Function }) {
    const close = () => {
        localStorage.removeItem('replyMessage')
        handleRpl(false)
    }
    const [msg, setMsg] = useState<any>(JSON.parse(localStorage.getItem('replyMessage') as string))
    useEffect(() => {
        setMsg(JSON.parse(localStorage.getItem('replyMessage') as string))
    }, [rpl])
    return (
        <div className={`${rpl ? 'flex' : 'hidden'} h-12 absolute  bottom-0 bg-dark-2 w-full`}>
            <div className={`text-primary-500 px-3`}>
                <Rep fontSize='large' />
            </div>
            <div className='flex items-center h-full text-white text-sm w-[calc(100%-80px)] overflow-hidden whitespace-nowrap text-ellipsis'>
                <p >{msg?.messageText}</p>

            </div>
            <button onClick={close} className={`text-gray-500 px-3`}>
                <Close fontSize='medium' />
            </button>
        </div>
    )
}

export default Reply