const KLAVIYO_EVENTS_URL = 'https://a.klaviyo.com/api/events';

async function sendWelcomeEvent(email: string, firstName: string) {
  await fetch(KLAVIYO_EVENTS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Klaviyo-API-Key ${process.env.KLAVIYO_API_KEY!}`,
      'content-type': 'application/json',
      revision: '2024-10-15',
    },
    body: JSON.stringify({
      data: {
        type: 'event',
        attributes: {
          properties: { firstName },
          metric: { data: { type: 'metric', attributes: { name: 'Welcome' } } },
          profile: { data: { type: 'profile', attributes: { email, first_name: firstName } } },
        },
      },
    }),
  }).catch(() => {});
}

export async function sendWelcomeEmail(firstName: string, email: string) {
  await sendWelcomeEvent(email, firstName);
}
