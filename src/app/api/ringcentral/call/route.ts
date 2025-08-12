
import { NextResponse } from 'next/server';
import { SDK } from '@ringcentral/sdk';
import { auth as adminAuth, db } from '@/lib/firebase-admin';

// Initialize the RingCentral SDK
const rcsdk = new SDK({
  server: process.env.RC_SERVER_URL,
  clientId: process.env.RC_CLIENT_ID,
  clientSecret: process.env.RC_CLIENT_SECRET,
});

const platform = rcsdk.platform();

async function login() {
  if (!(await platform.loggedIn())) {
    await platform.login({ jwt: process.env.RC_ADMIN_JWT });
  }
}

export async function POST(request: Request) {
  try {
    const { toNumber, fromNumber } = await request.json();
    const authHeader = request.headers.get('Authorization');

    if (!toNumber) {
      return NextResponse.json({ error: 'Missing "toNumber" in request body' }, { status: 400 });
    }
     if (!fromNumber) {
      return NextResponse.json({ error: 'Missing "fromNumber" (caller ID) in request body' }, { status: 400 });
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    const userData = userDoc.data();
    const extensionId = userData?.ringcentralExtensionId;
    const allowedNumbers = userData?.assignedPhoneNumbers || [];

    if (!allowedNumbers.includes(fromNumber)) {
        return NextResponse.json({ error: 'You are not authorized to use this caller ID.'}, { status: 403});
    }

    if (!extensionId) {
      return NextResponse.json({ error: 'User is not provisioned for calling' }, { status: 403 });
    }

    await login();

    const ringoutResponse = await platform.post('/restapi/v1.0/account/~/extension/~/ring-out', {
      from: { phoneNumber: fromNumber },
      to: { phoneNumber: toNumber },
      // The country code is important for international calling
      country: { id: '1' }, // Assuming US for now
      callerId: { phoneNumber: fromNumber },
      playPrompt: true,
    });

    const ringoutData = await ringoutResponse.json();
    
    return NextResponse.json({ success: true, details: ringoutData });

  } catch (e: any) {
    console.error('RingCentral API Error:', e);
    const errorDetails = e.message || 'An unknown error occurred.';
    if (e.response) {
      const errorBody = await e.response.json();
      console.error("API Error Body:", errorBody);
      return NextResponse.json({ error: 'Failed to initiate call', details: errorBody.message || errorDetails }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to initiate call', details: errorDetails }, { status: 500 });
  }
}
