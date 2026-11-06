import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CLI_AGENT = /^(curl|wget|httpie|xh)/i;

export function proxy(request: NextRequest) {
  if (CLI_AGENT.test(request.headers.get('user-agent') ?? '')) {
    return NextResponse.rewrite(new URL('/cli', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/',
};
