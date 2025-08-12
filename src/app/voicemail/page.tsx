
import { VoicemailList } from "@/components/voicemail-list";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Voicemail } from "lucide-react";

export default function VoicemailPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Voicemail</h1>
        <p className="text-muted-foreground">Listen to and manage your voicemails.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Voicemail />
            Voicemail Inbox
          </CardTitle>
          <CardDescription>
            A log of your recent voicemails.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VoicemailList />
        </CardContent>
      </Card>
    </div>
  );
}
