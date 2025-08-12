
'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatsCards } from "@/components/analytics/stats-cards";
import { getAnalyticsDataAction } from '../actions';
import type { AnalyticsData } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const PerformanceChart = dynamic(() => import('@/components/analytics/performance-chart').then(mod => mod.PerformanceChart), { 
    ssr: false,
    loading: () => <Skeleton className="h-[300px] w-full" />
});
const CallStatsChart = dynamic(() => import('@/components/analytics/call-stats-chart').then(mod => mod.CallStatsChart), { 
    ssr: false,
    loading: () => <Skeleton className="h-[300px] w-full" />
});


export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      const result = await getAnalyticsDataAction();
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setAnalyticsData(result.data);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Analytics Overview</h1>
        <p className="text-muted-foreground">Track your performance and gain valuable insights into your operations.</p>
      </div>
      
      {error && (
         <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Could Not Load Analytics</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <StatsCards stats={analyticsData?.stats} loading={loading} />

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Performance Visualizations</CardTitle>
          <CardDescription>Visual representation of call volume and user performance.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            <PerformanceChart data={analyticsData?.userPerformance} loading={loading} />
            <CallStatsChart data={analyticsData?.callVolume} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
}
