
import 'dotenv/config';
import * as admin from 'firebase-admin';

let app: admin.app.App;
let auth: admin.auth.Auth;
let db: admin.firestore.Firestore;
let storage: admin.storage.Storage;

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (serviceAccountKey) {
  try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    }
    app = admin.app();
    auth = admin.auth();
    db = admin.firestore();
    storage = admin.storage();
  } catch (e: any) {
    console.error('Failed to initialize Firebase Admin SDK:', e.message);
  }
} else {
  console.warn(
    'FIREBASE_SERVICE_ACCOUNT_KEY is not set. Firebase Admin SDK not initialized. Server-side features will not work.'
  );
  // Assign dummy objects to prevent crashes on import for local development
  app = {} as admin.app.App;
  auth = {} as admin.auth.Auth;
  db = {} as admin.firestore.Firestore;
  storage = {} as admin.storage.Storage;
}

export { app, db, storage, auth };
