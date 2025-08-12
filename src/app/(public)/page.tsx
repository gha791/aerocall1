
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Sparkles, Phone, Users, Mic } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const features = [
  {
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    title: 'AI-Powered Summaries',
    description: 'Automatically get summaries, action items, and sentiment analysis from every call recording.',
  },
  {
    icon: <Phone className="h-8 w-8 text-primary" />,
    title: 'Integrated Business VoIP',
    description: 'Make and receive crystal-clear calls directly from the app with your dedicated business number.',
  },
  {
    icon: <Mic className="h-8 w-8 text-primary" />,
    title: 'Live Call Transcription',
    description: 'Get real-time, accurate captions during your calls to never miss a single important detail.',
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Seamless Team Collaboration',
    description: 'Invite your team members, manage roles, and work together from a single, unified platform.',
  },
];


const HeroSection = () => (
  <section className="container mx-auto px-4 py-16 sm:py-24">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div className="text-center md:text-left">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline leading-tight">
          The All-in-One Cloud Phone System for Your Business
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          AEROCALL combines a powerful business phone with AI-driven intelligence to streamline your communication, boost productivity, and capture every critical detail.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
          <Button asChild size="lg">
            <Link href="/signup">Get Started for Free</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/login">Contact Sales</Link>
          </Button>
        </div>
      </div>
      <div>
        <Image
          src="https://placehold.co/600x400.png"
          alt="Dashboard Preview"
          width={600}
          height={400}
          className="rounded-lg shadow-xl mx-auto"
          data-ai-hint="business communication"
        />
      </div>
    </div>
  </section>
);

const FeaturesSection = () => (
  <section className="bg-muted/40 py-16 sm:py-24">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold font-headline">Powerful Features, Simple Interface</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Everything you need to manage your business communications effectively.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="p-3 bg-primary/10 w-fit rounded-lg">
                {feature.icon}
              </div>
              <CardTitle className="font-headline pt-4">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

const CtaSection = () => (
    <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="bg-primary text-primary-foreground p-12 rounded-lg text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Ready to Transform Your Business Communication?</h2>
            <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">
                Join hundreds of businesses that trust AEROCALL to handle their most important conversations. Get started in minutes.
            </p>
            <div className="mt-8">
                <Button asChild size="lg" variant="secondary">
                    <Link href="/signup">Sign Up Now</Link>
                </Button>
            </div>
        </div>
    </section>
)


export default function LandingPage() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <CtaSection />
    </div>
  );
}
