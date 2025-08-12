
'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PlusCircle, MoreVertical, Trash2, Edit, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { User, TeamMember } from '@/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { getTeamMembersAction, inviteTeamMemberAction, removeTeamMemberAction, updateTeamMemberRoleAction } from '@/app/settings/actions';
import { useAuth } from '@/hooks/use-auth';

const inviteSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  role: z.string().min(1, "Please select a role."),
});
type InviteFormData = z.infer<typeof inviteSchema>;

function InviteMemberDialog({ onInvitationSent }: { onInvitationSent: () => void }) {
  const [open, setOpen] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  const { toast } = useToast();
  
  const form = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: '', role: '' },
  });

  const onSubmit = async (data: InviteFormData) => {
    setIsSending(true);
    const result = await inviteTeamMemberAction(data);
    setIsSending(false);

    if (result?.error) {
      toast({ variant: 'destructive', title: 'Invitation Failed', description: result.error });
    } else {
      toast({ title: 'Invitation Sent!', description: `An invitation has been sent to ${data.email}.` });
      onInvitationSent();
      setOpen(false);
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Invite New Member</DialogTitle>
          <DialogDescription>
            Enter the email and select a role for the new team member. They will receive an email to set up their account.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl><Input type="email" placeholder="name@company.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Agent">Agent</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
              <Button type="submit" disabled={isSending}>
                {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Invitation
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const TeamMemberRow = React.memo(function TeamMemberRow({ member, onUpdate, isCurrentUser }: { member: TeamMember, onUpdate: () => void, isCurrentUser: boolean }) {
  const { toast } = useToast();
  
  const handleRoleChange = async (role: string) => {
    const result = await updateTeamMemberRoleAction(member.uid, role);
    if(result?.error) {
      toast({ variant: 'destructive', title: 'Update Failed', description: result.error });
    } else {
      toast({ title: 'Role Updated', description: `${member.name}'s role has been changed.`});
      onUpdate();
    }
  }

  const handleRemove = async () => {
     if (!confirm(`Are you sure you want to remove ${member.name} from the team?`)) return;
    const result = await removeTeamMemberAction(member.uid);
     if(result?.error) {
      toast({ variant: 'destructive', title: 'Removal Failed', description: result.error });
    } else {
      toast({ title: 'Member Removed', description: `${member.name} has been removed from the team.`});
      onUpdate();
    }
  }
  
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage 
              src={member.avatar} 
              alt={member.name} 
              data-ai-hint="person portrait"
            />
            <AvatarFallback>{member.name?.charAt(0) ?? member.email.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
              <div className="font-medium">{member.name ?? '(pending invitation)'} {isCurrentUser && '(You)'}</div>
              <div className="text-sm text-muted-foreground">{member.email}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={member.role === 'Admin' ? 'default' : 'secondary'}>{member.role}</Badge>
      </TableCell>
       <TableCell>
        <Badge variant={member.status === 'active' ? 'outline' : 'secondary'} className={member.status === 'active' ? 'text-green-600 border-green-500' : ''}>
          {member.status}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={isCurrentUser}>
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Actions for {member.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => handleRoleChange(member.role === 'Admin' ? 'Agent' : 'Admin')}>
            <Edit className="mr-2 h-4 w-4" />
            Change Role to {member.role === 'Admin' ? 'Agent' : 'Admin'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={handleRemove}>
            <Trash2 className="mr-2 h-4 w-4" />
            Remove Member
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      </TableCell>
    </TableRow>
  )
});

export function TeamMembers() {
  const [members, setMembers] = React.useState<TeamMember[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  
  const fetchMembers = React.useCallback(async () => {
    setLoading(true);
    const result = await getTeamMembersAction();
    if (result?.error) {
      toast({ variant: "destructive", title: "Error", description: result.error });
    } else {
      setMembers(result.members || []);
    }
    setLoading(false);
  }, [toast]);

  React.useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle className="font-headline">Team Members</CardTitle>
            <CardDescription>Manage who has access to this workspace.</CardDescription>
        </div>
        <InviteMemberDialog onInvitationSent={fetchMembers} />
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TeamMemberRow key={member.uid || member.email} member={member} onUpdate={fetchMembers} isCurrentUser={currentUser?.uid === member.uid} />
            ))}
          </TableBody>
        </Table>
        )}
      </CardContent>
    </Card>
  );
}
