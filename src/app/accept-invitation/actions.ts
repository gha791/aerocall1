
'use server';

import { db, auth } from '@/lib/firebase-admin';
import { z } from 'zod';

const acceptSchema = z.object({
  token: z.string().min(1, 'Token is required.'),
  name: z.string().min(2, 'Name is required.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export async function getInvitationDetailsAction(token: string) {
    try {
        const invitationSnapshot = await db.collection('invitations').where('token', '==', token).limit(1).get();

        if (invitationSnapshot.empty) {
            return { error: 'This invitation is invalid or has already been used.' };
        }

        const invitationDoc = invitationSnapshot.docs[0];
        const invitation = invitationDoc.data();

        // Check for expiration
        if (invitation.expiresAt.toDate() < new Date()) {
            await invitationDoc.ref.delete(); // Clean up expired token
            return { error: 'This invitation has expired.' };
        }

        return { invitation: { email: invitation.email } };

    } catch (e: any) {
        console.error(e);
        return { error: 'An unexpected error occurred while verifying the invitation.' };
    }
}

export async function acceptInvitationAction(input: z.infer<typeof acceptSchema>) {
    const validated = acceptSchema.safeParse(input);
    if (!validated.success) {
        return { error: 'Invalid data provided.' };
    }

    const { token, name, password } = validated.data;

    const invitationSnapshot = await db.collection('invitations').where('token', '==', token).limit(1).get();
    
    if (invitationSnapshot.empty) {
        return { error: 'This invitation is invalid or has already been used.' };
    }
    
    const invitationDoc = invitationSnapshot.docs[0];
    const invitation = invitationDoc.data();

    if (invitation.expiresAt.toDate() < new Date()) {
        await invitationDoc.ref.delete();
        return { error: 'This invitation has expired.' };
    }

    try {
        // Create user in Firebase Auth
        const userRecord = await auth.createUser({
            email: invitation.email,
            password: password,
            displayName: name,
        });

        // Create user profile in Firestore
        await db.collection('users').doc(userRecord.uid).set({
            uid: userRecord.uid,
            teamId: invitation.teamId,
            email: invitation.email,
            name: name,
            role: invitation.role,
            createdAt: new Date().toISOString(),
        });

        // Delete the invitation so it can't be reused
        await invitationDoc.ref.delete();
        
        return { uid: userRecord.uid };

    } catch (e: any) {
         if (e.code === 'auth/email-already-exists') {
            return { error: 'A user with this email address already exists.' };
        }
        console.error(e);
        return { error: 'Failed to create account.' };
    }
}
