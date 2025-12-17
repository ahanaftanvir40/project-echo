import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

interface InviteCodePageProps {
    params: Promise<{ inviteCode: string }>
}

async function InviteCodePage({ params }: InviteCodePageProps) {

    const profile = await currentProfile()
    if (!profile) {
        const { redirectToSignIn } = await auth()
        return redirectToSignIn()
    }

    const { inviteCode } = await params

    if (!inviteCode) {
        return redirect('/main')
    }

    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: inviteCode,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    if (existingServer) {
        return redirect(`/servers/${existingServer.id}`)
    }

    const server = await db.server.update({
        where: {
            inviteCode: inviteCode
        },
        data: {
            members: {
                create: [
                    { profileId: profile.id }
                ]
            }
        }
    })

    if(server){
        return redirect(`/servers/${server.id}`)
    }


    return null
        
   
}

export default InviteCodePage
