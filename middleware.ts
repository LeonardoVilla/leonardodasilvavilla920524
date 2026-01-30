import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const auth = request.cookies.get("pm_auth")?.value;

    if (!auth) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("from", request.nextUrl.pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:png|jpg|jpeg|gif|svg|webp|avif|ico)$).*)",
    ],
};
