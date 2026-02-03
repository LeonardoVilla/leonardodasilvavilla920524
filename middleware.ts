import { NextResponse } from "next/server";

export function middleware() {
    // Auth is handled in the client (login modal + token).
    // Keeping middleware non-blocking avoids redirect loops and lets public pages render.
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|api|login|.*\\.(?:png|jpg|jpeg|gif|svg|webp|avif|ico)$).*)",
    ],
};
