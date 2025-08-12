
'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2, Loader2, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Contact } from "@/types";
import { saveContactAction, getContactsAction, deleteContactAction } from '@/app/contacts/actions';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Dialer } from './dialer';

const contactSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  companyName: z.string().min(1, "Company name is required"),
  phone: z.string().min(1, "Phone number is required"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactForm = React.memo(function ContactForm({ contact, onSave, onFinished }: { contact?: Contact; onSave: (data: ContactFormData) => Promise<void>; onFinished: () => void; }) {
  const [isSaving, setIsSaving] = React.useState(false);
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: contact ? { ...contact } : {
      name: "",
      companyName: "",
      phone: "",
    },
  });

  async function onSubmit(data: ContactFormData) {
    setIsSaving(true);
    await onSave(data);
    setIsSaving(false);
    onFinished();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Name</FormLabel>
              <FormControl>
                <Input placeholder="John Smith" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Smith Trucking" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="(555) 123-4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="ghost">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Contact
            </Button>
        </DialogFooter>
      </form>
    </Form>
  );
});

export function ContactDialog({ children, contact, onContactUpdate }: { children: React.ReactNode, contact?: Contact, onContactUpdate: () => void }) {
    const { toast } = useToast();
    const [open, setOpen] = React.useState(false);

    const handleSave = async (data: ContactFormData) => {
        const contactToSave = {
            ...data,
            id: contact?.id,
        };

        const result = await saveContactAction(contactToSave);

        if (result.error) {
            toast({ variant: "destructive", title: "Save Failed", description: result.error });
        } else {
            toast({ title: "Contact Saved!", description: "The contact has been successfully saved." });
            onContactUpdate();
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                <DialogTitle className="font-headline">{contact ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
                <DialogDescription>
                    {contact ? 'Update the details for this contact.' : 'Fill in the information for the new contact.'}
                </DialogDescription>
                </DialogHeader>
                <ContactForm contact={contact} onSave={handleSave} onFinished={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}


export function ContactsTable() {
  const [contacts, setContacts] = React.useState<Contact[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  const fetchContacts = React.useCallback(async () => {
    setLoading(true);
    const result = await getContactsAction();
    if (result.error) {
        toast({ variant: "destructive", title: "Error fetching contacts", description: result.error });
        setContacts([]);
    } else {
        setContacts(result.contacts || []);
    }
    setLoading(false);
  }, [toast]);

  React.useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleDelete = async (contactId: string) => {
    const result = await deleteContactAction(contactId);
    if (result.error) {
      toast({ variant: "destructive", title: "Delete Failed", description: result.error });
    } else {
      toast({ title: "Contact Deleted", description: "The contact has been removed." });
      fetchContacts();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Company</TableHead>
          <TableHead className="hidden md:table-cell">Phone</TableHead>
          <TableHead className="hidden sm:table-cell">Tags</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((contact) => (
          <TableRow key={contact.id}>
            <TableCell className="font-medium">{contact.name}</TableCell>
            <TableCell>{contact.companyName}</TableCell>
            <TableCell className="hidden md:table-cell">{contact.phone}</TableCell>
            <TableCell className="hidden sm:table-cell">
              <div className="flex gap-1">
                {contact.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </TableCell>
            <TableCell className="text-right flex items-center justify-end gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Phone className="mr-2 h-4 w-4" />
                            Call
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <Dialer />
                    </PopoverContent>
                </Popover>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <ContactDialog contact={contact} onContactUpdate={fetchContacts}>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                  </ContactDialog>
                  <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(contact.id!)}>
                     <Trash2 className="mr-2 h-4 w-4" />
                     <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
