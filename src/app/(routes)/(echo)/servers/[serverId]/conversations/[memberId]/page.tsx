import MediaRoom from '@/app/components/MediaRoom'
import ChatHeader from '@/app/components/chat/ChatHeader'
import ChatInput from '@/app/components/chat/ChatInput'
import ChatMessages from '@/app/components/chat/ChatMessages'
import { getOrCreateConversation } from '@/lib/Conversation'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'



async function MemberIdPage({ params, searchParams }: { params: Promise<{ memberId: string, serverId: string }>, searchParams: Promise<{ video?: boolean }> }) {

  const profile = await currentProfile()

  if (!profile) {
    const { redirectToSignIn } = await auth()
    return redirectToSignIn()
  }

  const { memberId, serverId } = await params
  const { video } = await searchParams

  const currentMember = await db.member.findFirst({
    where: {
      serverId: serverId,
      profileId: profile.id

    },
    include: {
      profile: true
    }
  })

  if (!currentMember) {
    return redirect('/main')
  }

  const conversation = await getOrCreateConversation(currentMember.id, memberId)

  if (!conversation) {
    return redirect(`/servers/${serverId}`)
  }

  const { memberOne, memberTwo } = conversation

  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne
  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col min-h-screen'>
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={serverId}
        type='conversation'

      />
      {video && (
        <MediaRoom
          chatId={conversation.id}
          video={true}
          audio={true}
        />
      )}
      {!video && (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.profile.name}
            chatId={conversation.id}
            type='conversation'
            apiUrl='/api/direct-messages'
            paramKey='conversationId'
            paramValue={conversation.id}
            socketUrl='/api/socket/direct-messages'
            socketQuery={{
              conversationId: conversation.id
            }}
          />
          <ChatInput
            name={otherMember.profile.name}
            type='conversation'
            apiUrl='/api/socket/direct-messages'
            query={{
              conversationId: conversation.id
            }}
          />
        </>
      )}

    </div>
  )
}

export default MemberIdPage
