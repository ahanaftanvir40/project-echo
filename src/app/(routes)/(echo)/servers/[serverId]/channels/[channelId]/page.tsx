import MediaRoom from '@/app/components/MediaRoom'
import ChatHeader from '@/app/components/chat/ChatHeader'
import ChatInput from '@/app/components/chat/ChatInput'
import ChatMessages from '@/app/components/chat/ChatMessages'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { ChannelType } from '@prisma/client'
import { redirect } from 'next/navigation'
import React, { useEffect } from 'react'

async function ChannelIdPage({ params }: { params: Promise<{ serverId: string, channelId: string }> }) {

  const profile = await currentProfile()

  if (!profile) {
    const { redirectToSignIn } = await auth()
    return redirectToSignIn()
  }

  const { serverId, channelId } = await params

  const channel = await db.channel.findUnique({
    where: {
      id: channelId
    }
  })

  const member = await db.member.findFirst({
    where: {
      serverId: serverId,
      profileId: profile.id
    }
  })



  if (!channel || !member) {
    return redirect('/main')
  }

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col min-h-screen'>
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type='channel'
      />

      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            member={member}
            name={channel.name}
            chatId={channel.id}
            type='channel'
            apiUrl='/api/messages'
            socketUrl='/api/socket/messages'
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId
            }}
            paramKey='channelId'
            paramValue={channel.id}
          />

          <ChatInput
            name={channel.name}
            type='channel'
            apiUrl='/api/socket/messages'
            query={{
              channelId: channel.id,
              serverId: channel.serverId
            }}
          />
        </>
      )}

      {channel.type === ChannelType.AUDIO && (
        <MediaRoom
          chatId={channel.id}
          video={false}
          audio={true}
          
        />
      )}

      {channel.type === ChannelType.VIDEO && (
        <MediaRoom
          chatId={channel.id}
          video={true}
          audio={true}
        />
      )}


    </div>
  )
}

export default ChannelIdPage
