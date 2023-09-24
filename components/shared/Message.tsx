'use client'
import { Message } from "@/types"
import { DeleteOutline, Reply } from "@mui/icons-material"
import { motion } from 'framer-motion'
import { useEffect, useState } from "react"
import ConfirmMessage from "./ConfirmMessage"
interface Props {
    message: Message,
    currentUserId: string,
    handleRpl: Function,
    type: string
}
function Message({ message, currentUserId, handleRpl, type }: Props) {
    const isCurrentUserMessage = type === 'bot' ? !message.reply || message.sender?._id !== currentUserId : message.sender?._id === currentUserId
    const date = new Date(message.timestamp)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        const box = document.getElementById('box')
        if (isCurrentUserMessage) {
            box?.scroll({
                top: 0,
                left: 0,
                behavior: "smooth",
            })
        }
    }, [])
    const [open, setOpen] = useState(false);
    const handleClose = async () => {
        setOpen(!open)
    }
    const replying = () => {
        localStorage.setItem('replyMessage', JSON.stringify(message))
        handleRpl(true)
    }

    return (
        <motion.div onClick={() => { setIsOpen(!isOpen) }} className={`${isCurrentUserMessage ? 'bg-[rgb(47,94,143)] place-self-end rounded-t-lg rounded-l-lg' : 'bg-dark-3 rounded-t-lg rounded-r-lg'} group-hover:text-white mx-3 my-[2px] p-3 relative w-fit  max-w-[50%] h-max text-light-1`}>
            {
                message.reply && (
                    <div className="flex mb-2">
                        <div className="h-auto w-[2.5px] mx-1 bg-[rgb(78,129,183)]" />
                        <div className="w-full">
                            <h5 className="text-sky-200">{message.reply.sender.name}</h5>
                            <p className="max-w-[300px] text-sm overflow-hidden whitespace-nowrap text-ellipsis ">{message.reply.messageText}</p>
                        </div>
                    </div>
                )
            }
            {type === 'group' && (
                <h5 className="text-secondary-500">{message.sender?.name}</h5>
            )}
            {type === 'bot' && isCurrentUserMessage && (
                <h5 className="text-secondary-500">{message.sender?.name}</h5>
            )}
            {type === 'bot' && !isCurrentUserMessage && (
                <h5 className="text-secondary-500">{message.Bot?.botName}</h5>
            )}
            <p className="text-sm mx-1">{message.messageText}</p>
            <p className={`${isCurrentUserMessage ? 'text-gray-400' : 'text-gray-500'} text-xs font-light w-full text-right px-1`}>{date.toUTCString().slice(0, 22)}</p>
            <motion.div variants={{
                open: {
                    opacity: 1,
                    display: 'block',
                    transition: {
                        type: "spring",
                        bounce: 0,
                        duration: 0.7,
                        delayChildren: 0.3,
                        staggerChildren: 0.05
                    }
                },
                closed: {
                    display: 'none',
                    opacity: 0,
                    transition: {
                        type: "spring",
                        bounce: 0,
                        duration: 0.3
                    }
                }
            }} animate={isOpen ? "open" : "closed"} className={`${isCurrentUserMessage ? 'left-[-50px]' : 'right-[-50px]'} absolute top-1/2 translate-y-[-50%] gap-2`}>
                {
                    type !== 'bot' && (
                        <button onClick={replying} className="mr-1 text-gray-500 hover:text-white">
                            <Reply fontSize="small" />
                        </button>
                    )
                }
                <button onClick={handleClose} className="mr-1 text-gray-500 hover:text-red-700">
                    <DeleteOutline fontSize="small" />
                </button>
                <ConfirmMessage message={"Do you want to delete this message?"} action={"Delete"} id={message._id} open={open} handleClose={handleClose} type={type} />

            </motion.div>
        </motion.div>
    )
}

export default Message