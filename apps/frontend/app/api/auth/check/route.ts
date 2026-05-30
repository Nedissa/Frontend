export async function GET(request: Request) {
  const cookies = request.headers.get('cookie') || '';
  const tokenMatch = cookies.match(/medusa_token=([^;]+)/);
  const isLoggedIn = !!tokenMatch?.[1];
  return Response.json({ isLoggedIn });
}
