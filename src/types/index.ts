





export type User = {
  id: string; 
  name: string; 
  firstName?: string;
  lastName?: string;
  email: string;
  avatar?: string;
  role?: 'Admin' | 'Agent';
  businessName?: string;
  registeredCountry?: string;
  operationCountry?: string;
  teamSize?: string;
  howHeard?: string;
  state?: string;
  areaCode?: string;
  teamId?: string; // ID of the team/organization they belong to
  assignedPhoneNumbers?: string[];
  ringcentralExtensionId?: string;
};

export type TeamMember = {
  uid: string;
  email: string;
  name: string | null;
  role: 'Admin' | 'Agent';
  status: 'active' | 'pending';
  avatar?: string;
}

export type SubscriptionPlan = 'Basic' | 'Pro' | 'Team';

export type Subscription = {
  plan: SubscriptionPlan;
  status: 'active' | 'locked' | 'canceled';
  price: number;
  currency: 'USD';
  usage: {
    calls: {
      used: number;
      limit: number;
    };
    messages: {
      used: number;
      limit: number;
    };
    users: {
      used: number;
      limit: number;
    };
  };
};

export type BillingHistoryItem = {
  id: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Failed';
  invoiceUrl: string;
};

export type Contact = {
  id: string;
  name: string;
  companyName: string;
  phone: string;
  tags?: string[];
  preferredLanes?: string;
  type?: 'Carrier' | 'Broker' | 'Shipper';
  ringcentralExtensionId?: string; 
};

export type Call = {
  id: string;
  contact: Pick<Contact, 'id' | 'name'>;
  user: Pick<User, 'id' | 'name' | 'avatar'>;
  status: 'answered' | 'missed' | 'voicemail';
  direction: 'inbound' | 'outbound';
  duration: string;
  timestamp: string;
  recordingUrl?: string;
};

export type CallNote = {
  id: string;
  callId: string;
  userId: string;
  note: string;
  followUpRequired: boolean;
  statusUpdate?: string;
  timestamp: string;
};

export type Document = {
  id:string;
  name: string;
  type: 'Broker Packet' | 'Insurance' | 'POD' | 'Other';
  size: number;
  uploadedAt: string;
  userId?: string; // Made optional
  storagePath: string;
  downloadUrl: string;
  contactId?: string;
};

export type AnalyticsData = {
    stats: {
        totalCalls: number;
        missedCalls: number;
        avgTalkTime: string;
        answerRate: string;
    };
    callVolume: { date: string; calls: number }[];
    userPerformance: { name: string; calls: number }[];
};
