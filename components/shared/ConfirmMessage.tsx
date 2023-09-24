import { deleteBotMessage } from '@/lib/actions/bot.actions'
import { deleteGroupMessage } from '@/lib/actions/group.actions'
import { deleteMessage } from '@/lib/actions/message.actions'
import { pusherClient } from '@/lib/pusher'
// import { pusherClient } from '@/lib/pusher'
// import { toPusherKey } from '@/lib/utils'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface Props {
    message: string,
    action: string,
    id: string,
    open: boolean,
    handleClose: () => {},
    type: string
}


function ConfirmMessage({ message, action, id, open, handleClose, type }: Props) {
    const path = usePathname()
    const deleteMsg = async () => {
        if (type === 'user') {
            await deleteMessage(id, path)
        } else {
            if (type === 'group') {
                await deleteGroupMessage(id, path)
            } else {
                await deleteBotMessage(id, path)
            }
        }
        handleClose()
    }
    const router = useRouter()
    useEffect(() => {
        pusherClient.subscribe(id)
        const functionHandler = () => { router.refresh() }
        pusherClient.bind('bind:messageDelete', functionHandler)
        return () => {
            pusherClient.unsubscribe(id)
            pusherClient.unbind('bind:messageDelete', functionHandler)
        }
    }, []);
    return (
        <div className='bg-dark-2'>
            <Dialog
                open={open}
                color='inherit'
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogContent >
                    <DialogContentText sx={{ color: '#fff' }}>
                        {message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={deleteMsg} autoFocus>
                        {action}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ConfirmMessage