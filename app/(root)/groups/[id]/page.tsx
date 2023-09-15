import BoxBody from '@/components/shared/BoxBody';
import BoxFooter from '@/components/shared/BoxFooter';
import BoxHeader from '@/components/shared/BoxHeader';
import { checkGroup, getGroup, getGroupMessage } from '@/lib/actions/group.actions';
import { getUser } from '@/lib/actions/user.actions';
import { Group, Message } from '@/types';
import { currentUser } from '@clerk/nextjs'
interface Params {
  id: string
}
async function page({ params }: { params: Params }) {
  const clerkUser = await currentUser();
  const currUser = JSON.parse(await getUser(clerkUser?.id, false))
  const joined = await checkGroup(params.id, currUser?._id)
  const group: Group = JSON.parse(await getGroup(params.id))
  console.log(group)
  let message: Array<Message | any> = [];
  if (joined) {
    const { messages, isNext } = await getGroupMessage(params.id, '', 1, 30)
    message = JSON.parse(messages)

  }
  return (
    <div className="bg-dark-1 w-screen h-screen flex flex-col relative">
      <BoxHeader type='group' group={group} isJoin={joined} currentUserId={currUser?._id} contactUserId={params.id} />
      <BoxBody type='group' messages={message} isContact={joined} currentUserId={currUser?._id} contactUserId={params.id} />

      {
        joined && (
          <BoxFooter type='group' currentUserId={currUser?._id} contactUserId={params.id} />
        )
      }
    </div>
  )
}

export default page