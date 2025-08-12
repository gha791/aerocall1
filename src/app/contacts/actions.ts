
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase-admin';
import type { Contact } from '@/types';
import { revalidatePath } from 'next/cache';

const contactSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  companyName: z.string().min(1, "Company name is required"),
  phone: z.string().min(1, "Phone number is required"),
});

type SaveContactInput = z.infer<typeof contactSchema>;

export async function saveContactAction(input: SaveContactInput): Promise<{ error?: string }> {
  if (!db.collection) {
    return { error: 'Firestore is not initialized. Please check your configuration.' };
  }
  
  const validatedFields = contactSchema.safeParse({ ...input });
  if (!validatedFields.success) {
    return { error: 'Invalid data provided.' };
  }

  const { id, ...contactData } = validatedFields.data;
  const contactsCollection = db.collection('contacts');

  try {
    if (id) {
      const contactRef = contactsCollection.doc(id);
      await contactRef.update(contactData);
    } else {
      await contactsCollection.add(contactData);
    }
    revalidatePath('/contacts');
    return {};
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function getContactsAction(): Promise<{ contacts?: Contact[], error?: string }> {
  if (!db.collection) {
    console.warn('Firestore is not initialized. Returning empty contacts list.');
    return { contacts: [] };
  }
  try {
    const querySnapshot = await db.collection('contacts').orderBy('name').get();
    const contacts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Contact[];
    return { contacts };
  } catch (e: any) {
    console.error("Error fetching contacts:", e);
    return { error: e.message };
  }
}

export async function deleteContactAction(contactId: string): Promise<{ error?: string }> {
  if (!db.collection) {
    return { error: 'Firestore is not initialized. Please check your configuration.' };
  }
  try {
    const contactRef = db.collection('contacts').doc(contactId);
    await contactRef.delete();
    revalidatePath('/contacts');
    return {};
  } catch (e: any) {
    return { error: e.message };
  }
}
