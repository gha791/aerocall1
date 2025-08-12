
'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle } from 'lucide-react';
import { acceptInvitationAction, getInvitationDetailsAction } from './actions';
import { Skeleton } from '@/components/ui/skeleton';

const acceptSchema = z.object({
  token: z.string(),
  name: z.string().min(2, 'Name is required.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type AcceptFormData = z.infer<typeof acceptSchema>;

function AcceptInvitationForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { toast } = useToast();
  const [invitation, setInvitation] = useState<{ email: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<AcceptFormData>({
    resolver: zodResolver(acceptSchema),
    defaultValues: { token: token || '', name: '', password: '' },
  });
  
  useEffect(() => {
    if (!token) {
      setError('No invitation token provided. Please use the link from your email.');
      setLoading(false);
      return;
    }

    async function fetchInvitation() {
      const result = await getInvitationDetailsAction(token!);
      if (result.error || !result.invitation) {
        setError(result.error || 'This invitation is invalid or has expired.');
      } else {
        setInvitation(result.invitation);
        form.setValue('token', token!);
      }
      setLoading(false);
    }

    fetchInvitation();
  }, [token, form]);
  
  async function onSubmit(data: AcceptFormData) {
    setSubmitting(true);
    const result = await acceptInvitationAction(data);
    
    if (result.error) {
      toast({ variant: 'destructive', title: 'Setup Failed', description: result.error });
      setSubmitting(false);
    } else {
      toast({ title: 'Account Created!', description: 'You have successfully joined the team.' });
      // Log the user in automatically
      try {
        await login(invitation!.email, data.password);
        setIsSuccess(true); // Triggers success animation and redirect
      } catch (loginError: any) {
         toast({ variant: 'destructive', title: 'Login Failed', description: 'Your account was created, but auto-login failed. Please go to the login page.' });
      }
    }
  }

  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-destructive">Invitation Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
        <CardFooter>
            <Button asChild className="w-full">
                <Link href="/login">Go to Login</Link>
            </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md relative overflow-hidden">
        <div className={isSuccess ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
            <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl">Join Your Team</CardTitle>
            <CardDescription>
                You've been invited to join a team. Complete your account setup below. Your email is <span className="font-semibold text-primary">{invitation?.email}</span>.
            </CardDescription>
            </CardHeader>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                        <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Choose a Password</FormLabel>
                        <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </CardContent>
                <CardFooter>
                <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Complete Account Setup
                </Button>
                </CardFooter>
            </form>
            </Form>
        </div>
        {isSuccess && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background animate-in fade-in duration-500">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold">Setup Complete!</h2>
            <p className="text-muted-foreground">Redirecting to your dashboard...</p>
          </div>
        )}
    </Card>
  );
}


export default function AcceptInvitationPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
               <AcceptInvitationForm />
            </Suspense>
        </div>
    )
}
