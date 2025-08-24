import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if email already exists
    const existingSubscription = await sql`
      SELECT id FROM newsletter_subscriptions WHERE email = ${email}
    `;

    if (existingSubscription.length > 0) {
      return Response.json({ message: 'Email already subscribed' }, { status: 200 });
    }

    // Add new subscription
    await sql`
      INSERT INTO newsletter_subscriptions (email) VALUES (${email})
    `;

    return Response.json({ message: 'Successfully subscribed to newsletter' }, { status: 200 });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return Response.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}