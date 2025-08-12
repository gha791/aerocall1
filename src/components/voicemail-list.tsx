
'use client';

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Call } from "@/types";
import { MoreVertical, Info, AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { getVoicemailsAction } from "@/app/actions";
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";


const Card = React.memo(({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
      className={`bg-card text-card-foreground border rounded-lg shadow-sm ${className}`}
      {...props}
    />
));
Card.displayName = 'Card';


const VoicemailItem = React.memo(function VoicemailItem({ voicemail }: { voicemail: Call }) {
  return (
    <Card className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage 
            src={voicemail.user.avatar} 
            data-ai-hint="person portrait"
            width={40}
            height={40}
          />
          <AvatarFallback>{voicemail.contact.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <div className="font-medium">{voicemail.contact.name}</div>
          <div className="text-sm text-muted-foreground">
            {voicemail.timestamp}
          </div>
        </div>
      </div>
      <div className="flex-grow">
        {voicemail.recordingUrl ? (
          <audio controls src={voicemail.recordingUrl} className="w-full">
            Your browser does not support the audio element.
          </audio>
        ) : (
          <p className="text-sm text-muted-foreground">No recording available.</p>
        )}
      </div>
      <div className="flex items-center justify-end gap-2">
         <Badge variant="secondary" className="hidden sm:inline-flex">{voicemail.duration}</Badge>
        <Button variant="outline" size="sm">Call Back</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Mark as Heard</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  )
});

const ListSkeleton = () => (
    <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
             <Card key={i} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                </div>
                <div className="flex-grow">
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="flex items-center justify-end gap-2">
                    <Skeleton className="h-8 w-24" />
                </div>
            </Card>
        ))}
    </div>
)


export function VoicemailList() {
  const [voicemails, setVoicemails] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVoicemails() {
      setLoading(true);
      setError(null);
      const result = await getVoicemailsAction();
      if (result.error) {
        setError(result.error);
      } else if (result.calls) {
        setVoicemails(result.calls);
      }
      setLoading(false);
    }
    fetchVoicemails();
  }, []);

  if (loading) {
    return <ListSkeleton />;
  }

  if (error) {
    return (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Failed to load voicemails</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    )
  }

  if (voicemails.length === 0) {
    return (
        <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>No Voicemails</AlertTitle>
            <AlertDescription>There are no voicemails in your inbox right now.</AlertDescription>
        </Alert>
    )
  }

  return (
    <div className="space-y-4">
      {voicemails.map((voicemail) => (
        <VoicemailItem key={voicemail.id} voicemail={voicemail} />
      ))}
    </div>
  );
}
