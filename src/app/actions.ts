
'use server';

import { analyzeCallLogs, AnalyzeCallLogsInput, AnalyzeCallLogsOutput, getCallSummaryAction as getCallSummaryActionFlow, CallSummaryInput, CallSummaryOutput } from "@/ai/flows/analyze-call-logs";
import { SDK } from '@ringcentral/sdk';
import type { Call, AnalyticsData } from "@/types";
import { formatDistanceToNow, subDays, format } from 'date-fns';

export async function analyzeCallLogsAction(input: AnalyzeCallLogsInput): Promise<AnalyzeCallLogsOutput | { error: string }> {
  try {
    const output = await analyzeCallLogs(input);
    return output;
  } catch (e: any) {
    console.error(e);
    return { error: e.message || "An unknown error occurred." };
  }
}

export async function getCallSummaryAction(input: CallSummaryInput): Promise<CallSummaryOutput | { error: string }> {
    return getCallSummaryActionFlow(input);
}


async function getRingCentralPlatform() {
  if (
    !process.env.RC_CLIENT_ID ||
    !process.env.RC_CLIENT_SECRET ||
    !process.env.RC_ADMIN_JWT
  ) {
    console.warn("Calling credentials are not configured in environment variables.");
    return null;
  }

  const rcsdk = new SDK({
    server: process.env.RC_SERVER_URL,
    clientId: process.env.RC_CLIENT_ID,
    clientSecret: process.env.RC_CLIENT_SECRET,
  });

  const platform = rcsdk.platform();

  if (!(await platform.loggedIn())) {
    await platform.login({ jwt: process.env.RC_ADMIN_JWT });
  }

  return platform;
}

const transformCallLogRecord = (record: any): Call => ({
    id: record.id,
    contact: {
      id: record.to?.phoneNumber || record.from?.phoneNumber,
      name: record.to?.name || record.from?.name || 'Unknown',
    },
    user: {
      id: 'user-1', // This should be mapped to an actual user in a real scenario
      name: record.extension?.name || 'System', // Placeholder
      avatar: '',
    },
    status: record.result === 'Missed' ? 'missed' : (record.type === 'VoiceMail' ? 'voicemail' : 'answered'),
    direction: record.direction.toLowerCase(),
    duration: new Date(record.duration * 1000).toISOString().substr(14, 5),
    timestamp: formatDistanceToNow(new Date(record.startTime), { addSuffix: true }),
    recordingUrl: record.recording?.contentUri,
});


export async function getRecentCallsAction(): Promise<{ calls?: Call[], error?: string }> {
  const platform = await getRingCentralPlatform();
  if (!platform) {
    return { error: "Calling integration is not configured on the server." };
  }

  try {
    const response = await platform.get('/restapi/v1.0/account/~/extension/~/call-log', {
      view: 'Detailed',
      perPage: 25,
    });

    const callLogData = await response.json();
    
    const calls: Call[] = callLogData.records.map(transformCallLogRecord);

    return { calls };

  } catch (e: any) {
    console.error("Calling API Error:", e.message);
    return { error: "Failed to fetch recent calls." };
  }
}


export async function getVoicemailsAction(): Promise<{ calls?: Call[], error?: string }> {
  const platform = await getRingCentralPlatform();
  if (!platform) {
    return { error: "Calling integration is not configured on the server." };
  }

  try {
    const response = await platform.get('/restapi/v1.0/account/~/extension/~/call-log', {
      view: 'Detailed',
      type: 'VoiceMail',
      perPage: 25,
    });

    const callLogData = await response.json();
    const voicemails: Call[] = callLogData.records.map(transformCallLogRecord);
    return { calls: voicemails };

  } catch (e: any) {
    console.error("Calling API Error:", e.message);
    return { error: "Failed to fetch voicemails." };
  }
}

export async function getAnalyticsDataAction(): Promise<{ data?: AnalyticsData; error?: string }> {
  const platform = await getRingCentralPlatform();
  if (!platform) {
    return { error: "Calling integration is not configured on the server." };
  }

  try {
    const dateFrom = subDays(new Date(), 30).toISOString();
    const response = await platform.get('/restapi/v1.0/account/~/extension/~/call-log', {
      view: 'Detailed',
      dateFrom: dateFrom,
      perPage: 1000, // Fetch up to 1000 records for the last 30 days
    });

    const callLogData = await response.json();
    const records = callLogData.records;

    // Calculate Stats
    const totalCalls = records.length;
    const missedCalls = records.filter((r: any) => r.result === 'Missed').length;
    const answeredCalls = records.filter((r: any) => r.result !== 'Missed' && r.duration > 0);
    const totalTalkTime = answeredCalls.reduce((acc: number, r: any) => acc + r.duration, 0);
    const avgTalkTimeSeconds = answeredCalls.length > 0 ? totalTalkTime / answeredCalls.length : 0;
    const avgTalkTime = `${Math.floor(avgTalkTimeSeconds / 60)}m ${Math.round(avgTalkTimeSeconds % 60)}s`;
    
    const inboundCalls = records.filter((r: any) => r.direction === 'Inbound');
    const answeredInboundCalls = inboundCalls.filter((r: any) => r.result !== 'Missed').length;
    const answerRate = inboundCalls.length > 0 ? `${Math.round((answeredInboundCalls / inboundCalls.length) * 100)}%` : '0%';

    // Prepare Chart Data
    const callVolume = records.reduce((acc: { [key: string]: { date: string, calls: number } }, record: any) => {
        const date = format(new Date(record.startTime), 'MMM d');
        if (!acc[date]) {
            acc[date] = { date, calls: 0 };
        }
        acc[date].calls += 1;
        return acc;
    }, {});
    
    const userPerformance = records.reduce((acc: { [key: string]: { name: string, calls: number } }, record: any) => {
        const userName = record.extension?.name || 'Unknown';
        if (userName === 'Unknown') return acc; // Skip calls not associated with a user
        if (!acc[userName]) {
            acc[userName] = { name: userName.split(' ')[0], calls: 0 }; // Use first name
        }
        acc[userName].calls += 1;
        return acc;
    }, {});

    const data: AnalyticsData = {
        stats: {
            totalCalls,
            missedCalls,
            avgTalkTime,
            answerRate,
        },
        callVolume: Object.values(callVolume).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        userPerformance: Object.values(userPerformance),
    };

    return { data };

  } catch (e: any) {
    console.error("Calling API Error:", e.message);
    return { error: "Failed to fetch analytics data." };
  }
}
