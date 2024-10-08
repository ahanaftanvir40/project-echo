import ServerSidebar from '@/app/components/server/ServerSidebar'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

async function ServerLayout({ children, params }: {
    children: React.ReactNode
    params: { serverId: string }

}) {

    const profile = await currentProfile()

    if (!profile) {
        return auth().redirectToSignIn()
    }

    const server = db.server.findUnique({
        where: {
            id: params.serverId,
            members: {
                some: {
                    profileId: profile.id
                }
            }

        }
    })

    if(!server){
        return redirect('/main')
    }



    return (
        <div className='h-full'>
            <div className='hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0'>
                <ServerSidebar serverId = {params.serverId} />
            </div>

            <main className='min-h-screen md:pl-60 '>
            {children}
            </main>
        </div>
    )
}

export default ServerLayout
