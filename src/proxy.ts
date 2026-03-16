export { auth as proxy } from '@/lib/auth';

// Optionally, don't invoke Proxy on some paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
