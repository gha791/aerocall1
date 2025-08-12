import DashboardLayout from "./dashboard-layout";
import { AssistantCard } from "@/components/assistant-card";
import { CallLogTable } from "@/components/call-log-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Phone } from "lucide-react";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Welcome to your Dashboard</h1>
          <p className="text-muted-foreground">Here's a quick overview of your operations.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <AssistantCard />
          </div>
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <Phone />
                  Recent Calls
                </CardTitle>
                <CardDescription>
                  A log of your most recent inbound and outbound calls.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CallLogTable />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
