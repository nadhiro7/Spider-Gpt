'use client'
import SendForm from '../forms/SendForm'
import AttachFileIcon from '@mui/icons-material/AttachFile';

interface Props {
    currentUserId: string,
    contactUserId: string,
    type: string
}
function BoxFooter({ currentUserId, contactUserId, type }: Props) {
    return (
        <div className='h-12 flex sticky bg-dark-2 w-full bottom-0'>
            {/* <button className={`text-gray-500 px-3`}>
                <AttachFileIcon fontSize='large' />
            </button> */}
            <SendForm type={type} currentUserId={currentUserId} contactUserId={contactUserId} />
        </div>
    )
}

export default BoxFooter