
'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogIn, CheckCircle, XCircle } from "lucide-react";
import React from "react";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

// In a real app, this would be fetched from the user's database record
const mockIntegrationStatus = {
    voip: true, 
};

export function IntegrationsForm() {
    const [status, setStatus] = React.useState(mockIntegrationStatus);

    // This would be the function that triggers the provisioning flow
    const handleConnect = () => {
        // In a real implementation, this would trigger a backend process
        // to provision a number for the user via the white-label API.
        console.log("Initiating VoIP provisioning flow...");
        setStatus(prev => ({ ...prev, voip: true }));
    };

    const handleDisconnect = () => {
        // This would call your backend to de-provision the number
        console.log("Disconnecting VoIP...");
        setStatus(prev => ({ ...prev, voip: false }));
    };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">VoIP Connection</CardTitle>
        <CardDescription>
          Manage your integrated phone system to enable calling and messaging directly from AEROCALL.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <Alert>
          <AlertTitle className="font-semibold">How does this work?</AlertTitle>
          <AlertDescription>
            Your plan includes a fully integrated business phone line. All calling features are powered by our secure infrastructure, so you don't need a separate provider.
          </AlertDescription>
        </Alert>

        <Card className="p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-muted rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 fill-primary">
                          <path d="M16.5 12.5C16.5 13.3284 15.8284 14 15 14H9C8.17157 14 7.5 13.3284 7.5 12.5V12.5C7.5 11.6716 8.17157 11 9 11H15C15.8284 11 16.5 11.6716 16.5 12.5V12.5Z"></path>
                          <path d="M6 17.5C6 19.433 7.567 21 9.5 21H14.5C16.433 21 18 19.433 18 17.5V13H6V17.5Z"></path>
                          <path d="M18 11V6.5C18 4.567 16.433 3 14.5 3H9.5C7.567 3 6 4.567 6 6.5V11H18Z"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-semibold">AEROCALL Calling</h3>
                        <p className="text-sm text-muted-foreground">Integrated Business Phone Line</p>
                    </div>
                </div>

                {status.voip ? (
                    <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="border-green-500 text-green-700">
                           <CheckCircle className="mr-2 h-4 w-4" /> Connected
                        </Badge>
                        <Button variant="destructive" size="sm" onClick={handleDisconnect}>Disconnect</Button>
                    </div>
                ) : (
                    <Button onClick={handleConnect}>
                        <LogIn className="mr-2 h-4 w-4" /> Activate Calling
                    </Button>
                )}
            </div>
        </Card>

      </CardContent>
    </Card>
  );
}
