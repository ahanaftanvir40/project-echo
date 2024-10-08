import { Menu } from 'lucide-react'
import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/app/components/ui/sheet"
import { Button } from './ui/button'
import NavigationSidebar from './navigation/NavigationSidebar'
import ServerSidebar from './server/ServerSidebar'


function MobileToggle({ serverId }: { serverId: string }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant='ghost' size='icon' className='md:hidden'>
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side='left' className='p-0 flex gap-0'>
                <div className='w-[72px]'>
                    <NavigationSidebar />
                </div>
                <ServerSidebar serverId={serverId} />
            </SheetContent>
        </Sheet>
    )
}

export default MobileToggle
