import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("userToken")?.value
    const { pathname } = req.nextUrl

    if (token && (pathname === "/login" || pathname === "/register")) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    if (!token &&
        (
            pathname.startsWith("/dashboard") ||
            pathname.startsWith("/profile") ||
            pathname.startsWith("/documents") ||
            pathname.startsWith("/flashcards") ||
            pathname.startsWith("/quizzes")
        )
    ) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/login",
        "/register",
        "/dashboard/:path*",
        "/quizzes/:path*",
        "/profile/:path*",
        "/documents/:path*",
        "/flashcards/:path*"
    ]
}
