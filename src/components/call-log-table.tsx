
'use client';

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
  DialogClose
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import type { Call } from "@/types";
import { cn } from "@/lib/utils";
import { PhoneForwarded, PhoneMissed, PhoneOutgoing, Voicemail, MoreVertical, Plus, Loader2, AlertTriangle, Info, Sparkles, FileText, Bot } from "lucide-react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import React, { useEffect, useState } from "react";
import { getRecentCallsAction, getCallSummaryAction } from "@/app/actions";
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import type { CallSummaryOutput } from "@/ai/flows/analyze-call-logs";
import { ScrollArea } from "./ui/scroll-area";

const statusIcons = {
  answered: <PhoneForwarded className="h-4 w-4 text-green-500" />,
  missed: <PhoneMissed className="h-4 w-4 text-red-500" />,
  voicemail: <Voicemail className="h-4 w-4 text-blue-500" />,
};


function CallSummaryDialog({ call, children }: { call: Call; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [summary, setSummary] = useState<CallSummaryOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSummary = async () => {
    if (!call.recordingUrl) {
      setError("No recording available to summarize.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSummary(null);

    // This is a placeholder for fetching the real audio data as a data URI.
    // In a real app, you would fetch the blob from call.recordingUrl,
    // convert it to a Base64 string, and create a data URI.
    const mockAudioDataUri = 'data:audio/mp3;base64,SUQz...'; // This is a fake, truncated data URI.
    
    const result = await getCallSummaryAction({ audioRecordingUri: mockAudioDataUri });

    if (result.error) {
      setError(result.error);
    } else {
      setSummary(result as CallSummaryOutput);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchSummary();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline flex items-center gap-2">
            <Sparkles className="text-primary"/> AI Summary for call with {call.contact.name}
          </DialogTitle>
          <DialogDescription>
            AI-generated insights from the call recording.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-4 p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Analyzing recording, please wait...</p>
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Analysis Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {summary && (
            <ScrollArea className="h-96 pr-4">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2"><Bot className="h-5 w-5"/>Call Summary</h3>
                  <p className="text-sm text-muted-foreground">{summary.summary}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2"><Info className="h-5 w-5"/>Action Items</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {summary.actionItems.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Sentiment</h3>
                  <Badge variant={summary.sentiment === 'Positive' ? 'default' : (summary.sentiment === 'Negative' ? 'destructive' : 'secondary')}>
                    {summary.sentiment}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2"><FileText className="h-5 w-5"/>Full Transcript</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">{summary.fullTranscript}</p>
                </div>
              </div>
            </ScrollArea>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CallNoteDialog({ call }: { call: Call }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" /> Add Note
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Add Note for call with {call.contact.name}</DialogTitle>
          <DialogDescription>
            Log details about your call. This will be saved for future reference.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="message">Your note</Label>
            <Textarea placeholder="Type your message here." id="message" />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="follow-up" />
            <Label htmlFor="follow-up">Mark for follow-up</Label>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save note</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const TableSkeleton = () => (
    <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4">
                <Skeleton className="h-6 w-24 rounded-md" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-4 w-24 hidden md:block" />
                <Skeleton className="h-4 w-16 hidden md:block" />
                <Skeleton className="h-8 w-24" />
            </div>
        ))}
    </div>
)

export function CallLogTable() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCalls() {
      setLoading(true);
      setError(null);
      const result = await getRecentCallsAction();
      if (result.error) {
        setError(result.error);
      } else if (result.calls) {
        setCalls(result.calls);
      }
      setLoading(false);
    }
    fetchCalls();
  }, []);

  if (loading) {
    return <TableSkeleton />;
  }

  if (error) {
    return (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Failed to load calls</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    )
  }

  if (calls.length === 0) {
    return (
        <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>No Recent Calls</AlertTitle>
            <AlertDescription>There are no calls to display in your log right now.</AlertDescription>
        </Alert>
    )
  }


  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Status</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead className="hidden md:table-cell">Timestamp</TableHead>
          <TableHead className="hidden md:table-cell">Duration</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {calls.map((call) => (
          <TableRow key={call.id}>
            <TableCell>
              <Badge variant={call.status === 'missed' ? 'destructive' : 'secondary'} className="capitalize flex items-center gap-2">
                {statusIcons[call.status as keyof typeof statusIcons]}
                {call.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="font-medium">{call.contact.name}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                {call.direction === 'inbound' ? <PhoneForwarded className="h-3 w-3" /> : <PhoneOutgoing className="h-3 w-3" />}
                <span className="capitalize">{call.direction} call</span>
              </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">{call.timestamp}</TableCell>
            <TableCell className="hidden md:table-cell">{call.duration}</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <div className="hidden sm:block">
                    <CallNoteDialog call={call} />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="sm:hidden">
                        Add Note
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        View Contact
                    </DropdownMenuItem>
                    {call.recordingUrl && (
                      <>
                        <DropdownMenuSeparator />
                        <CallSummaryDialog call={call}>
                           <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Sparkles className="mr-2 h-4 w-4" />
                              AI Summary
                           </DropdownMenuItem>
                        </CallSummaryDialog>
                        <DropdownMenuItem onClick={() => window.open(call.recordingUrl, '_blank')}>
                            Listen to Recording
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
