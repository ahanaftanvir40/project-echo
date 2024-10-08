import { initialProfile } from "@/lib/initial-profile"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import CreateServerModal from "../components/modals/CreateServerModal"

async function SetupPage() {
    const profile = await initialProfile()
    const server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    if (server) {
        return redirect(`/servers/${server.id}`)
    }

    return (
        <div>
            <CreateServerModal />
        </div>
    )
}

export default SetupPage
