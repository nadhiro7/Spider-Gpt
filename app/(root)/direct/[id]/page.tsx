import BoxBody from '@/components/shared/BoxBody';
import BoxFooter from '@/components/shared/BoxFooter';
import BoxHeader from '@/components/shared/BoxHeader';
import { isUserInContacts } from '@/lib/actions/contact.actions';
import { getMessages } from '@/lib/actions/message.actions';
import { getUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs'
import { Message } from '@/types';
interface Params {
    id: string
}
async function page({ params }: { params: Params }) {
    const clerkUser = await currentUser();
    const currUser = await getUser(clerkUser?.id, false)
    const contactUser = JSON.parse(await getUser(params.id, true))
    const contact = await isUserInContacts(contactUser._id, JSON.parse(currUser)?._id)
    let message: Array<Message> = [];
    if (contact) {
        const { messages, isNext } = await getMessages(JSON.parse(currUser)?._id, contactUser._id, 1, 30, '')
        message = JSON.parse(messages)

    }
    return (
        <div className="bg-dark-1 w-screen h-screen flex flex-col relative">
            <BoxHeader type='user' user={contactUser} isJoin={contact} currentUserId={JSON.parse(currUser)?._id} contactUserId={contactUser._id} />
            <BoxBody type='user' messages={message} isContact={contact} currentUserId={JSON.parse(currUser)?._id} contactUserId={contactUser._id} />
            {
                contact && (
                    <BoxFooter type='user' currentUserId={JSON.parse(currUser)?._id} contactUserId={contactUser._id} />
                )
            }
        </div>
    )
}

export default page