import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { ChannelType, MemberRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import React from 'react'
import ServerHeader from './ServerHeader';
import { ScrollArea } from '../ui/scroll-area';
import ServerSearch from './ServerSearch';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';

interface ServerSidebarProps {
    serverId: string;
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className='h-5 w-5 mr-2' />,
    [ChannelType.AUDIO]: <Mic className='h-5 w-5 mr-2' />,
    [ChannelType.VIDEO]: <Video className='h-5 w-5 mr-2' />,
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className='mr-2 h-5 w-5 text-indigo-500' />,
    [MemberRole.ADMIN]: <ShieldAlert className='mr-2 h-5 w-5 text-rose-500' />,

}

async function ServerSidebar({ serverId }: ServerSidebarProps) {

    const profile = await currentProfile()

    if (!profile) {
        return redirect('/main')
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: 'asc'
                }
            },
            members: {
                include: {
                    profile: true
                },
                orderBy: {
                    role: 'asc'
                }
            }
        }
    })

    const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT)
    const AudioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO)
    const VideoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO)

    //Filtering out the current user
    const members = server?.members.filter((member) => member.profileId !== profile.id)

    if (!server) {
        return redirect('/main')
    }

    const role = server.members.find((member) => member.profileId === profile.id)?.role




    return (
        <div className='flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]'>
            <ServerHeader server={server} role={role} />
            <ScrollArea className='flex-1 px-3'>
                <div className='mt-2'>
                    <ServerSearch data={[
                        {
                            label: 'Text Channels',
                            type: 'channel',
                            data: textChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: iconMap[channel.type]
                            }))
                        },
                        {
                            label: 'Voice Channels',
                            type: 'channel',
                            data: AudioChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: iconMap[channel.type]
                            }))
                        },
                        {
                            label: 'Video Channels',
                            type: 'channel',
                            data: VideoChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: iconMap[channel.type]
                            }))
                        },
                        {
                            label: 'Members',
                            type: 'member',
                            data: members?.map((member) => ({
                                id: member.id,
                                name: member.profile.name,
                                icon: roleIconMap[member.role]
                            }))
                        }
                        
                    ]} />
                </div>
            </ScrollArea>
        </div>
    )
}

export default ServerSidebar
