import { renderCliScreen } from '@/lib/cli-screen';

export const dynamic = 'force-dynamic';

export function GET() {
  return new Response(renderCliScreen(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
