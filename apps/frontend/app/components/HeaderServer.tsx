import { cookies, headers } from 'next/headers';
import { HeaderWrapper } from './HeaderWrapper';

export async function HeaderServer() {
  const cookieStore = await cookies();
  const headersList = await headers();
  const pathname = headersList.get('x-invoke-path') || headersList.get('x-pathname') || '';

  const token = cookieStore.get('medusa_token')?.value;
  const isLoggedIn = !!token;

  return <HeaderWrapper initialIsLoggedIn={isLoggedIn} />;
}
