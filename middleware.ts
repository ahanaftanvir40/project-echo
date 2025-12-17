import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


const isPublicRoute = createRouteMatcher(['/sign-in', '/sign-up', '/', '/api/uploadthing'])
const isAuthRoute = createRouteMatcher(['/sign-in', '/sign-up'])

export default clerkMiddleware(async (auth, req) => {

    const { userId } = await auth()
    const currentURL = req.nextUrl.pathname

    if (userId && isAuthRoute(req)) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    if (!userId && currentURL.startsWith('/test')) {
        return NextResponse.redirect(new URL('/sign-in', req.url))
    }

    return NextResponse.next()

});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
