import { User, Contact, Call, Document, Subscription, BillingHistoryItem } from "@/types";

export const mockUser: User = {
  id: 'user-1',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  avatar: 'https://placehold.co/32x32.png',
  role: 'Admin',
};

export const mockTeam: User[] = [
    mockUser,
    { id: 'user-2', name: 'John Doe', email: 'john.d@example.com', avatar: 'https://placehold.co/32x32.png', role: 'Agent' },
    { id: 'user-3', name: 'Mike Ross', email: 'mike.r@example.com', avatar: 'https://placehold.co/32x32.png', role: 'Agent' },
];

export const mockSubscription: Subscription = {
    plan: 'Pro',
    status: 'active',
    price: 49,
    currency: 'USD',
    usage: {
        calls: { used: 124, limit: 1000 },
        messages: { used: 340, limit: 1000 },
        users: { used: 3, limit: 5 },
    }
};

export const mockBillingHistory: BillingHistoryItem[] = [
    { id: 'inv-1', date: '2023-10-01', amount: 49.00, status: 'Paid', invoiceUrl: '#' },
    { id: 'inv-2', date: '2023-09-01', amount: 49.00, status: 'Paid', invoiceUrl: '#' },
    { id: 'inv-3', date: '2023-08-01', amount: 49.00, status: 'Paid', invoiceUrl: '#' },
];


export const mockContacts: Contact[] = [
  { id: 'contact-1', name: 'John Smith', companyName: 'Smith Trucking', phone: '(555) 123-4567', type: 'Carrier', tags: ['reliable', 'dry van'] },
  { id: 'contact-2', name: 'Maria Garcia', companyName: 'Garcia Logistics', phone: '(555) 987-6543', type: 'Broker', tags: ['west coast'] },
  { id: 'contact-3', name: 'David Johnson', companyName: 'Johnson & Sons', phone: '(555) 555-1212', type: 'Shipper', tags: [] },
  { id: 'contact-4', name: 'Emily White', companyName: 'White Line Haul', phone: '(555) 234-5678', type: 'Carrier', tags: ['reefer', 'midwest'], preferredLanes: 'IL to TX' },
  { id: 'contact-5', name: 'Carlos Rodriguez', companyName: 'CR Logistics', phone: '(555) 876-5432', type: 'Broker', tags: ['LTL', 'east coast'] },
];

export const mockCalls: Call[] = [
  { id: 'call-1', contact: { id: 'contact-1', name: 'John Smith' }, user: { id: 'user-1', name: 'Jane Doe', avatar: 'https://placehold.co/32x32.png' }, status: 'answered', direction: 'inbound', duration: '5:32', timestamp: '2 hours ago' },
  { id: 'call-2', contact: { id: 'contact-2', name: 'Maria Garcia' }, user: { id: 'user-1', name: 'Jane Doe', avatar: 'https://placehold.co/32x32.png' }, status: 'missed', direction: 'inbound', duration: '0:00', timestamp: '3 hours ago' },
  { id: 'call-3', contact: { id: 'contact-4', name: 'Emily White' }, user: { id: 'user-1', name: 'Jane Doe', avatar: 'https://placehold.co/32x32.png' }, status: 'answered', direction: 'outbound', duration: '12:45', timestamp: 'Yesterday' },
  { id: 'call-4', contact: { id: 'contact-5', name: 'Carlos Rodriguez' }, user: { id: 'user-2', name: 'John Doe', avatar: 'https://placehold.co/32x32.png' }, status: 'voicemail', direction: 'inbound', duration: '0:45', timestamp: 'Yesterday' },
  { id: 'call-5', contact: { id: 'contact-3', name: 'David Johnson' }, user: { id: 'user-1', name: 'Jane Doe', avatar: 'https://placehold.co/32x32.png' }, status: 'answered', direction: 'outbound', duration: '8:17', timestamp: '2 days ago' },
];

export const mockVoicemails: Call[] = [
    { id: 'vm-1', contact: { id: 'contact-5', name: 'Carlos Rodriguez' }, user: { id: 'user-2', name: 'John Doe', avatar: 'https://placehold.co/32x32.png' }, status: 'voicemail', direction: 'inbound', duration: '0:45', timestamp: 'Yesterday', recordingUrl: 'https://webaudioapi.com/samples/audio-tag/chrono.mp3' },
    { id: 'vm-2', contact: { id: 'contact-1', name: 'John Smith' }, user: { id: 'user-1', name: 'Jane Doe', avatar: 'https://placehold.co/32x32.png' }, status: 'voicemail', direction: 'inbound', duration: '1:12', timestamp: '3 days ago', recordingUrl: 'https://webaudioapi.com/samples/audio-tag/chrono.mp3' },
];

export const mockDocuments: Document[] = [
    { id: 'doc-1', name: 'BrokerPacket_Garcia.pdf', type: 'Broker Packet', size: 2.3 * 1024 * 1024, uploadedAt: '2023-10-26', contactId: 'contact-2', storagePath: '', downloadUrl: '' },
    { id: 'doc-2', name: 'Insurance_Smith_Trucking.pdf', type: 'Insurance', size: 1.1 * 1024 * 1024, uploadedAt: '2023-10-25', contactId: 'contact-1', storagePath: '', downloadUrl: '' },
    { id: 'doc-3', name: 'POD_#12345.jpg', type: 'POD', size: 800 * 1024, uploadedAt: '2023-10-24', storagePath: '', downloadUrl: '' },
    { id: 'doc-4', name: 'RateCon_White_Line.pdf', type: 'Other', size: 450 * 1024, uploadedAt: '2023-10-23', contactId: 'contact-4', storagePath: '', downloadUrl: '' },
    { id: 'doc-5', name: 'CarrierProfile.pdf', type: 'Broker Packet', size: 1.8 * 1024 * 1024, uploadedAt: '2023-10-22', storagePath: '', downloadUrl: '' },
];

export const mockAnalytics = {
    totalCalls: 124,
    missedCalls: 18,
    avgTalkTime: '7m 42s',
    callConversion: '15%',
};

export const mockPerformanceData = [
    { name: 'Jane D.', calls: 68 },
    { name: 'John D.', calls: 42 },
    { name: 'Mike R.', calls: 14 },
];

export const mockCallVolume = [
    { date: 'Mon', calls: 20 },
    { date: 'Tue', calls: 30 },
    { date: 'Wed', calls: 25 },
    { date: 'Thu', calls: 40 },
    { date: 'Fri', calls: 35 },
    { date: 'Sat', calls: 10 },
    { date: 'Sun', calls: 5 },
];
