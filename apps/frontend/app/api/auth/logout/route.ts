export async function POST(request: Request) {
  try {
    const response = Response.json({ success: true });

    // Clear the authentication cookies
    response.headers.append(
      'Set-Cookie',
      'medusa_token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0'
    );
    response.headers.append(
      'Set-Cookie',
      'is_logged_in=; Path=/; Secure; SameSite=Lax; Max-Age=0'
    );

    return response;
  } catch {
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
