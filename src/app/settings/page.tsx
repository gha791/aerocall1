
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/settings/profile-form";
import { TeamMembers } from "@/components/settings/team-members";
import { BillingDetails } from "@/components/settings/billing-details";
import { IntegrationsForm } from "@/components/settings/integrations-form";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings, team, billing, and integrations.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 md:w-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <ProfileForm />
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <TeamMembers />
        </TabsContent>

        <TabsContent value="billing" className="mt-6">
          <BillingDetails />
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <IntegrationsForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
