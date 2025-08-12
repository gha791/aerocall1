
'use server';

import { auth, db } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAuth } from "firebase-admin/auth";
import { headers } from "next/headers";
import { TeamMember } from "@/types";
import crypto from "crypto";

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["Admin", "Agent"]),
});

const profileSchema = z.object({
    firstName: z.string().min(1, 'First name is required.'),
    lastName: z.string().min(1, 'Last name is required.'),
    businessName: z.string().optional(),
    state: z.string().optional(),
    registeredCountry: z.string().optional(),
});

async function getAuthenticatedUser() {
    const authorization = headers().get('Authorization');
    if (!authorization?.startsWith('Bearer ')) {
        throw new Error('Unauthorized');
    }
    const idToken = authorization.split('Bearer ')[1];
    return await getAuth().verifyIdToken(idToken);
}


export async function updateUserProfileAction(input: z.infer<typeof profileSchema>) {
    const validated = profileSchema.safeParse(input);
    if (!validated.success) {
        return { error: 'Invalid input.' };
    }

    try {
        const decodedToken = await getAuthenticatedUser();
        const userRef = db.collection('users').doc(decodedToken.uid);

        const { firstName, lastName, ...otherData } = validated.data;
        const name = `${firstName} ${lastName}`.trim();

        const updateData = {
            ...otherData,
            firstName,
            lastName,
            name,
        };

        await userRef.update(updateData);
        await auth.updateUser(decodedToken.uid, { displayName: name });

        revalidatePath('/settings');
        return { user: { ...updateData, uid: decodedToken.uid } };
    } catch (e: any) {
        return { error: e.message || 'An unexpected error occurred.' };
    }
}


export async function inviteTeamMemberAction(input: {email: string, role: string}) {
    const validated = inviteSchema.safeParse(input);
    if (!validated.success) {
        return { error: 'Invalid input.' };
    }
    const { email, role } = validated.data;
    
    try {
        const decodedToken = await getAuthenticatedUser();
        const adminUserDoc = await db.collection('users').doc(decodedToken.uid).get();
        if (!adminUserDoc.exists || adminUserDoc.data()?.role !== 'Admin') {
            throw new Error('Not authorized to perform this action');
        }
        const adminUser = adminUserDoc.data()!;
        const teamId = adminUser.teamId || adminUser.uid;

        // Check if user already exists in the team
        const existingUserSnapshot = await db.collection('users').where('email', '==', email).where('teamId', '==', teamId).get();
        if (!existingUserSnapshot.empty) {
            return { error: 'A user with this email already exists in your team.' };
        }

        // Check for an existing pending invitation
        const invitationSnapshot = await db.collection('invitations').where('email', '==', email).where('teamId', '==', teamId).get();
        if (!invitationSnapshot.empty) {
            return { error: 'An invitation has already been sent to this email address.' };
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 day expiry

        await db.collection('invitations').add({
            teamId,
            email,
            role,
            token,
            expiresAt,
            createdAt: new Date(),
        });
        
        // In a real app, a Cloud Function would listen to this collection
        // and send an email with the link: /accept-invitation?token=${token}
        
        revalidatePath('/settings');
        return {};

    } catch (e: any) {
        return { error: e.message || 'An unexpected error occurred.' };
    }
}


export async function getTeamMembersAction(): Promise<{ members?: TeamMember[], error?: string }> {
    try {
        const decodedToken = await getAuthenticatedUser();
        const adminUserDoc = await db.collection('users').doc(decodedToken.uid).get();
        if (!adminUserDoc.exists || adminUserDoc.data()?.role !== 'Admin') {
            throw new Error('Not authorized to perform this action');
        }
        const adminUser = adminUserDoc.data()!;
        const teamId = adminUser.teamId || adminUser.uid;

        // Get active users
        const usersSnapshot = await db.collection('users').where('teamId', '==', teamId).get();
        const activeMembers: TeamMember[] = usersSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                uid: doc.id,
                email: data.email,
                name: data.name || null,
                role: data.role,
                status: 'active',
                avatar: data.avatar || '',
            }
        });

        // Get pending invitations
        const invitationsSnapshot = await db.collection('invitations').where('teamId', '==', teamId).get();
        const pendingMembers: TeamMember[] = invitationsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                uid: doc.id, // Using doc id as temporary key
                email: data.email,
                name: null,
                role: data.role,
                status: 'pending',
            }
        });
        
        const allMembers = [...activeMembers, ...pendingMembers];

        return { members: allMembers };
    } catch (e: any) {
        return { error: e.message || 'Failed to fetch team members.' };
    }
}

export async function updateTeamMemberRoleAction(uid: string, role: string) {
    if (role !== 'Admin' && role !== 'Agent') return { error: 'Invalid role specified.' };
    try {
        const decodedToken = await getAuthenticatedUser();
        const adminUserDoc = await db.collection('users').doc(decodedToken.uid).get();
        if (!adminUserDoc.exists || adminUserDoc.data()?.role !== 'Admin') {
            throw new Error('Not authorized to perform this action');
        }
        const adminUser = adminUserDoc.data()!;
        const teamId = adminUser.teamId || adminUser.uid;

        const memberRef = db.collection('users').doc(uid);
        const memberDoc = await memberRef.get();

        if (!memberDoc.exists || memberDoc.data()?.teamId !== teamId) {
            return { error: 'Member not found in your team.' };
        }

        await memberRef.update({ role });
        revalidatePath('/settings');
        return {};
    } catch (e: any) {
        return { error: e.message };
    }
}

export async function removeTeamMemberAction(uid: string) {
     try {
        const decodedToken = await getAuthenticatedUser();
        const adminUserDoc = await db.collection('users').doc(decodedToken.uid).get();
        if (!adminUserDoc.exists || adminUserDoc.data()?.role !== 'Admin') {
            throw new Error('Not authorized to perform this action');
        }
        const adminUser = adminUserDoc.data()!;
        const teamId = adminUser.teamId || adminUser.uid;
        
        const memberRef = db.collection('users').doc(uid);
        const memberDoc = await memberRef.get();

        if (memberDoc.exists && memberDoc.data()?.teamId === teamId) {
            // Option 1: Delete the user from Auth and Firestore
            await auth.deleteUser(uid);
            await memberRef.delete();
        } else {
            // If it's a pending invitation, it won't be in users collection.
            const invitationRef = db.collection('invitations').doc(uid);
            const invitationDoc = await invitationRef.get();
            if (invitationDoc.exists && invitationDoc.data()?.teamId === teamId) {
                await invitationRef.delete();
            } else {
                 return { error: 'Member or invitation not found.' };
            }
        }

        revalidatePath('/settings');
        return {};
    } catch (e: any) {
        return { error: e.message };
    }
}
