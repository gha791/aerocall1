'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { analyzeCallLogsAction } from '@/app/actions';
import { AnalyzeCallLogsOutput } from '@/ai/flows/analyze-call-logs';
import { Sparkles, AlertTriangle, Bell, Loader2 } from "lucide-react";
import { Separator } from './ui/separator';

export function AssistantCard() {
  const [logData, setLogData] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalyzeCallLogsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const defaultLogData = `[
  {"call_id": "c1", "type": "inbound", "duration_minutes": 5, "outcome": "booked_load", "topic": "rate negotiation"},
  {"call_id": "c2", "type": "inbound", "duration_minutes": 2, "outcome": "missed", "topic": "availability check"},
  {"call_id": "c3", "type": "outbound", "duration_minutes": 8, "outcome": "follow_up_needed", "topic": "delivery status"},
  {"call_id": "c4", "type": "inbound", "duration_minutes": 3, "outcome": "missed", "topic": "new inquiry"},
  {"call_id": "c5", "type": "inbound", "duration_minutes": 1, "outcome": "missed", "topic": "wrong number"}
]`;

  const handleAnalyze = async () => {
    if (!logData.trim()) {
      toast({
        variant: "destructive",
        title: "Input Required",
        description: "Please paste call logs to analyze.",
      });
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);

    const result = await analyzeCallLogsAction({ callLogs: logData });

    setIsLoading(false);

    if ('error' in result) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: result.error,
      });
    } else {
      setAnalysisResult(result);
      toast({
        title: "Analysis Complete",
        description: "Insights have been generated successfully.",
      });
    }
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 via-background to-background">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Sparkles className="text-accent" />
          Intelligent Assistant
        </CardTitle>
        <CardDescription>
          Paste your recent call logs in JSON format to get AI-powered insights, reminders, and notifications.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste call logs here..."
          className="min-h-[150px] font-mono text-sm"
          value={logData}
          onChange={(e) => setLogData(e.target.value)}
        />
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {analysisResult && (
          <div className="space-y-6 rounded-lg border bg-background/50 p-4">
            {analysisResult.insights && (
              <div className="space-y-2">
                <h3 className="font-headline text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Insights
                </h3>
                <p className="text-sm text-muted-foreground">{analysisResult.insights}</p>
              </div>
            )}
            
            {analysisResult.reminders && (
              <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-headline text-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-accent" />
                  Reminders
                </h3>
                <p className="text-sm text-muted-foreground">{analysisResult.reminders}</p>
              </div>
              </>
            )}

            {analysisResult.notifications && (
              <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-headline text-lg font-semibold flex items-center gap-2">
                  <Bell className="h-5 w-5 text-destructive" />
                  Notifications
                </h3>
                <p className="text-sm text-muted-foreground">{analysisResult.notifications}</p>
              </div>
              </>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="link" 
          className="p-0 h-auto"
          onClick={() => setLogData(defaultLogData)}
        >
          Use Sample Data
        </Button>
        <Button onClick={handleAnalyze} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Analyze Logs
        </Button>
      </CardFooter>
    </Card>
  );
}
