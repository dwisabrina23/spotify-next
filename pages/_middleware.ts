import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const signedInPages = ['/', '/playlist', '/library']

export default function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl

  if (signedInPages.find((p) => p === pathname)) {
    const { SALLY_ACCESS_TOKEN: token } = req.cookies

    if (!token) {
      return NextResponse.redirect(`${origin}/signin`)
    }
  }
}
