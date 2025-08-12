import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function MessagesPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold font-headline">Messages</h1>
        <p className="text-muted-foreground">Your centralized hub for SMS and WhatsApp communication.</p>
      </div>
      <Card className="flex flex-col items-center justify-center text-center p-8 md:p-16">
        <CardHeader>
            <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                <MessageSquare className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="font-headline mt-4">Coming Soon!</CardTitle>
            <CardDescription className="max-w-md mx-auto">
                We're working hard to bring you a fully integrated messaging experience.
                Soon you'll be able to manage all your SMS and WhatsApp conversations directly from AEROCALL.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="max-w-lg mx-auto">
            <svg width="100%" height="100%" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
                <rect x="50" y="50" width="300" height="120" rx="10" ry="10" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2"/>
                
                <rect x="65" y="65" width="60" height="40" rx="5" ry="5" fill="hsl(var(--muted))"/>
                <circle cx="80" cy="85" r="5" fill="hsl(var(--primary))"/>
                <circle cx="95" cy="85" r="5" fill="hsl(var(--primary))"/>
                <circle cx="110" cy="85" r="5" fill="hsl(var(--primary))"/>
                
                <rect x="140" y="70" width="180" height="8" rx="4" fill="hsl(var(--muted))"/>
                <rect x="140" y="85" width="150" height="8" rx="4" fill="hsl(var(--muted))"/>
                
                <rect x="65" y="120" width="220" height="8" rx="4" fill="hsl(var(--muted))"/>
                <rect x="65" y="135" width="190" height="8" rx="4" fill="hsl(var(--muted))"/>

                <path d="M 300 130 C 310 120, 320 120, 330 130 L 350 150 L 330 170 C 320 180, 310 180, 300 170 Z" fill="hsl(var(--accent))" />
                <line x1="318" y1="142" x2="332" y2="158" stroke="hsl(var(--accent-foreground))" strokeWidth="2"/>
                <line x1="332" y1="142" x2="318" y2="158" stroke="hsl(var(--accent-foreground))" strokeWidth="2"/>
            </svg>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
