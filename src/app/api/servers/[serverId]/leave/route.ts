import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req: NextRequest, { params }: { params: Promise<{ serverId: string }> }) {
    try {
        const profile = await currentProfile()
        const { serverId } = await params

        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if (!serverId) {
            return new NextResponse('No Server ID', { status: 400 })
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: {
                    not: profile.id
                },
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            data: {
                members: {
                    deleteMany: {
                        profileId: profile.id
                    }
                }
            }

        })

        return NextResponse.json(server)

    } catch (error) {
        return new NextResponse('Internal Error', { status: 500 })
    }
}
