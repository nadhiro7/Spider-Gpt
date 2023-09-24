import BoxBody from '@/components/shared/BoxBody';
import BoxFooter from '@/components/shared/BoxFooter';
import BoxHeader from '@/components/shared/BoxHeader';
import { checkBot, getBot, getBotMessage } from '@/lib/actions/bot.actions';
import { getUser } from '@/lib/actions/user.actions';
import { Bot } from '@/types';
import { Message } from '@/types';
import { currentUser } from '@clerk/nextjs'
interface Params {
  id: string
}
async function page({ params }: { params: Params }) {
  const clerkUser = await currentUser();
  const currUser = JSON.parse(await getUser(clerkUser?.id, false))
  const joined = await checkBot(params.id, currUser?._id)
  const bot: Bot = JSON.parse(await getBot(params.id))
  let message: Array<Message | any> = [];
  if (joined) {
    const { messages, isNext } = await getBotMessage(params.id, '', 1, 30)
    message = JSON.parse(messages)

  }
  return (
    <div className="bg-dark-1 w-screen h-screen flex flex-col relative">
      <BoxHeader type='bot' bot={bot} isJoin={joined} currentUserId={currUser?._id} contactUserId={params.id} />
      <BoxBody type='bot' messages={message} isContact={joined} currentUserId={currUser?._id} contactUserId={params.id} />

      {joined && (
        <BoxFooter type='bot' currentUserId={currUser?._id} contactUserId={params.id} />
      )}
    </div>
  )
}

export default page