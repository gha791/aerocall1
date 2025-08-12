'use client'

import { ContactsTable, ContactDialog } from "@/components/contacts-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import React from 'react';

export default function ContactsPage() {
  // A simple key to force re-render of the table
  const [tableKey, setTableKey] = React.useState(0);

  const handleContactUpdate = () => {
    setTableKey(prevKey => prevKey + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold font-headline">Contacts</h1>
          <p className="text-muted-foreground">Manage your carriers, brokers, and shippers.</p>
        </div>
        <ContactDialog onContactUpdate={handleContactUpdate}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </ContactDialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Contact List</CardTitle>
          <CardDescription>
            A comprehensive list of all your business contacts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContactsTable key={tableKey} />
        </CardContent>
      </Card>
    </div>
  );
}
