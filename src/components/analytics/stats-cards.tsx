
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, PhoneMissed, Clock, Percent } from "lucide-react";
import type { AnalyticsData } from "@/types";
import { Skeleton } from "../ui/skeleton";

type StatsCardsProps = {
    stats?: AnalyticsData['stats'];
    loading: boolean;
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
  
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
            <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-7 w-12" />
                </CardContent>
            </Card>
        ))}
      </div>
    );
  }
  
  const statsList = [
    { title: "Total Calls", value: stats?.totalCalls ?? 0, icon: <Phone className="h-4 w-4 text-muted-foreground" /> },
    { title: "Missed Calls", value: stats?.missedCalls ?? 0, icon: <PhoneMissed className="h-4 w-4 text-muted-foreground" /> },
    { title: "Average Talk Time", value: stats?.avgTalkTime ?? '0m 0s', icon: <Clock className="h-4 w-4 text-muted-foreground" /> },
    { title: "Answer Rate", value: stats?.answerRate ?? '0%', icon: <Percent className="h-4 w-4 text-muted-foreground" /> },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsList.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
