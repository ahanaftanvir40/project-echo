import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";



export async function DELETE(req: NextRequest, { params }: { params: { memberId: string } }) {
    try {

        const profile = await currentProfile()
        const { searchParams } = req.nextUrl
        const serverId = searchParams.get('serverId')

        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if (!serverId) {
            return new NextResponse('Server ID Missing', { status: 400 })

        }

        if (!params.memberId) {
            return new NextResponse('Member ID Missing', { status: 400 })
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                members: {
                    deleteMany: {
                        id: params.memberId,
                        profileId: {
                            not: profile.id
                        }
                    }
                }
            },
            include: {
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

        return NextResponse.json(server)


    } catch (error) {
        return new NextResponse('Internal Error', { status: 500 })
    }
}


export async function PATCH(req: NextRequest, { params }: { params: { memberId: string } }) {
    try {

        const profile = await currentProfile()
        const { searchParams } = req.nextUrl
        const { role } = await req.json()

        const serverId = searchParams.get('serverId')

        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if (!serverId) {
            return new NextResponse('Server ID Missing', { status: 400 })

        }

        if (!params.memberId) {
            return new NextResponse('Member ID Missing', { status: 400 })
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                members: {
                    update: {
                        where: {
                            id: params.memberId,
                            profileId: {
                                not: profile.id
                            }
                        },
                        data: {
                            role: role
                        }
                    }
                }
            },
            include: {
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


        return NextResponse.json(server)


    } catch (error) {
        return new NextResponse('Internal Error', { status: 500 })
    }
}