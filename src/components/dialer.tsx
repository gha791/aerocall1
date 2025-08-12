
'use client'

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Phone, Delete, Loader2, Square, Mic, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from './ui/label';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { makeCallApi } from '@/app/live-call/actions';

const dialerSchema = z.object({
  toNumber: z.string().min(1, 'A phone number is required.'),
  fromNumber: z.string().min(1, 'Please select a caller ID.'),
});

type DialerFormData = z.infer<typeof dialerSchema>;


export function Dialer() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCalling, setIsCalling] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [callStatus, setCallStatus] = useState('Idle');
  
  const form = useForm<DialerFormData>({
      resolver: zodResolver(dialerSchema),
      defaultValues: {
          toNumber: '',
          fromNumber: user?.assignedPhoneNumbers?.[0] || '',
      }
  });

  const { control, watch, setValue, getValues } = form;
  const toNumberValue = watch('toNumber');

  React.useEffect(() => {
    if (user?.assignedPhoneNumbers && user.assignedPhoneNumbers.length > 0) {
        setValue('fromNumber', user.assignedPhoneNumbers[0]);
    }
  }, [user, setValue])


  const handleKeyPress = (key: string) => {
    if (toNumberValue.length < 15) { // Limit number length
        setValue('toNumber', toNumberValue + key);
    }
  };

  const handleDelete = () => {
    setValue('toNumber', toNumberValue.slice(0, -1));
  };

  const handleEndCall = () => {
        setIsCalling(false);
        setIsRecording(false);
        setCallStatus('Call Ended');
        // Reset to initial state after a delay
        setTimeout(() => {
            setCallStatus('Idle');
            setTranscription('');
            setValue('toNumber', '');
        }, 2000);
    };

  const onSubmit = async (data: DialerFormData) => {
    if (!user) {
        toast({ variant: 'destructive', title: 'Not Authenticated', description: 'You must be logged in to make a call.'});
        return;
    }
   
    setIsCalling(true);
    setCallStatus(`Calling ${data.toNumber}...`);
    try {
      const idToken = await user.getIdToken();
      await makeCallApi(data.toNumber, data.fromNumber, idToken);
      toast({
        title: "Call Initiated",
        description: `Your phone will ring first to connect you.`,
      });

      // --- Start Live Call Simulation ---
      setCallStatus('Connected');
      setIsRecording(true);
      setTranscription('Live transcription will begin shortly...\n\n');
      // In a real implementation, a WebSocket would be opened here
      // to stream audio and receive real-time transcription.
      // For now, we simulate receiving transcription chunks.
      const mockCaptions = [
          "User: Hello, I'm calling about the load from Chicago to Dallas.",
          "Agent: Yes, I see that one. Are you available for pickup tomorrow?",
          "User: Yes, I can be there by 10 AM. What's the rate?",
          "Agent: The rate is $2,500. It's a full truckload.",
          "User: That works for me. Please send over the rate confirmation.",
          "Agent: Will do. I'm sending it to your email now. Thank you!",
      ];

      let captionIndex = 0;
      const intervalId = setInterval(() => {
          if (captionIndex < mockCaptions.length) {
              setTranscription(prev => prev + mockCaptions[captionIndex] + '\n');
              captionIndex++;
          } else {
              clearInterval(intervalId);
          }
      }, 3000); // Add a new line every 3 seconds
      
    } catch (error: any) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Call Failed",
            description: error.message || "Could not initiate the call.",
        });
        setIsCalling(false);
        setCallStatus('Idle');
    }
  };

  const keypad = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    '*', '0', '#',
  ];

  if (isCalling) {
    return (
        <div className="flex flex-col space-y-4">
            <div className="text-center">
                <h4 className="font-semibold text-lg">Live Call</h4>
                <p className="text-sm text-muted-foreground">
                    Status: <span className="font-medium text-primary">{callStatus}</span>
                </p>
                <p className="text-sm text-muted-foreground">To: {getValues('toNumber')}</p>
            </div>
            <Textarea
                readOnly
                value={transcription}
                className="h-[200px] resize-none font-mono"
                placeholder="Waiting for transcription..."
            />
             <div className="flex items-center text-sm text-green-500 animate-pulse mt-2 self-center">
                <Mic className="mr-2 h-4 w-4" /> Recording...
            </div>
            <Button className="w-full" variant="destructive" onClick={handleEndCall}>
                <Square className="mr-2 h-4 w-4" /> End Call
            </Button>
        </div>
    )
  }

  return (
    <div 
        className="flex flex-col items-center space-y-4" 
    >
        <div className="text-center">
            <h4 className="font-semibold text-lg">Dialer</h4>
            <p className="text-sm text-muted-foreground">Enter a number to call</p>
        </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        {user?.assignedPhoneNumbers && user.assignedPhoneNumbers.length > 0 ? (
            <Controller
                name="fromNumber"
                control={control}
                render={({ field }) => (
                    <div>
                        <Label htmlFor="caller-id">Caller ID</Label>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="caller-id" className="w-full">
                                <SelectValue placeholder="Select Caller ID" />
                            </SelectTrigger>
                            <SelectContent>
                                {user.assignedPhoneNumbers.map(num => (
                                    <SelectItem key={num} value={num}>{num}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                         {form.formState.errors.fromNumber && (
                            <p className="text-sm text-destructive mt-1">{form.formState.errors.fromNumber.message}</p>
                        )}
                    </div>
                )}
            />
        ) : (
             <div className="text-xs text-center text-muted-foreground p-2 bg-muted rounded-md">
                No phone number has been assigned to your account yet.
             </div>
        )}
        <div className="relative w-full">
            <Controller
                name="toNumber"
                control={control}
                render={({ field }) => (
                     <>
                        <Input 
                            {...field}
                            type="tel"
                            placeholder="(123) 456-7890"
                            className="pr-10 text-center text-lg h-12"
                            aria-label="Phone number"
                        />
                         {form.formState.errors.toNumber && (
                            <p className="text-sm text-destructive mt-1">{form.formState.errors.toNumber.message}</p>
                        )}
                    </>
                )}
            />
            
            {toNumberValue && (
                <Button 
                    type="button"
                    variant="ghost" 
                    size="icon" 
                    onClick={handleDelete}
                    className="absolute right-1 top-1.5 h-8 w-8"
                    aria-label="Delete last digit"
                    >
                    <Delete className="h-5 w-5" />
                </Button>
            )}
        </div>
        <div className="grid grid-cols-3 gap-2 w-full">
            {keypad.map(key => (
            <Button 
                type="button"
                key={key} 
                variant="outline" 
                className="h-14 text-xl font-bold"
                onClick={() => handleKeyPress(key)}
            >
                {key}
            </Button>
            ))}
        </div>
        <Button 
            type="submit"
            className="w-full h-14 bg-green-500 hover:bg-green-600"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
            {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Phone className="mr-2" />}
            Call
        </Button>
      </form>
    </div>
  );
}
