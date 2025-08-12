
'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

// This is a type definition for the Paddle object that will be available on the window
declare global {
  interface Window {
    Paddle: any;
  }
}

export function BillingDetails() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [paddle, setPaddle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // In a real app, this would come from your database and define plan features.
  const features = [
    'Unlimited USA and Canada calling',
    'AI-powered call summaries',
    'Unlimited contacts',
    '24/7 Customer Support'
  ];

  useEffect(() => {
    const paddleClientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;

    if (paddleClientToken && window.Paddle) {
      window.Paddle.Setup({ 
        token: paddleClientToken,
        eventCallback: function(data: any) {
            // The data object contains information about the event
            if (data.name === "checkout.completed") {
                // Here you would typically make a call to your backend
                // to verify the purchase and update the user's subscription status.
                console.log('Checkout completed:', data.data);
                toast({
                    title: 'Subscription Activated!',
                    description: 'Your account is now active. Thank you for subscribing!'
                });
            }
        }
      });
      // Set the initialized paddle instance to state
      setPaddle(window.Paddle);
    }
  }, [toast]);

  const handleActivateSubscription = () => {
    setIsLoading(true);
    if (!paddle) {
      toast({
        variant: 'destructive',
        title: 'Billing Not Configured',
        description: 'The billing system is not available at the moment. Please try again later.'
      });
      setIsLoading(false);
      return;
    }
    
    // This will open the Paddle checkout, where the user can purchase a plan.
    // Replace 'items' with your actual plan IDs from your Paddle dashboard.
    paddle.Checkout.open({
        settings: {
            displayMode: "overlay",
            theme: "light",
        },
        items: [
            {
                // This is a placeholder price ID. You should replace it with your actual plan's price ID from Paddle.
                priceId: 'pri_01j4d7y6z5x4a3b2c1d0e9f8g7', 
                quantity: 1
            }
        ],
        customer: {
            email: user?.email,
        }
    });

    setIsLoading(false);
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Subscription</CardTitle>
          <CardDescription>
            To activate your account, please choose a subscription plan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Card className="p-6 bg-muted/20">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Plan Features</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    {features.map(feature => (
                        <li key={feature} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
              </div>
            </Card>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t pt-6">
            <p className="text-sm text-muted-foreground mr-auto">
                All payments are securely handled by Paddle.
            </p>
            <Button size="lg" onClick={handleActivateSubscription} disabled={!paddle || isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Activate Subscription
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
