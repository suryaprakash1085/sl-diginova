import { AdminLayout } from "@/components/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { ContactMessage } from "@shared/api";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { MessageSquare, Mail, Phone, Calendar, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function MessagesManagement() {
  const { data: messages = [], isLoading } = useQuery<ContactMessage[]>({
    queryKey: ["messages"],
    queryFn: async () => {
      const res = await fetch("/api/messages");
      return res.json();
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-primary" /> Contact Messages
          </h2>
          <p className="text-slate-500 mt-1">View and respond to inquiries from your website visitors.</p>
        </div>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="w-[200px]">Sender</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="text-right">Received Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : messages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-slate-500">
                    No messages found.
                  </TableCell>
                </TableRow>
              ) : (
                messages.map((msg) => (
                  <TableRow key={msg.id} className="hover:bg-slate-50/50 transition-colors align-top">
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-slate-900 flex items-center gap-2">
                          <User className="w-3 h-3 text-slate-400" /> {msg.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        <span className="text-slate-600 flex items-center gap-2">
                          <Mail className="w-3 h-3 text-slate-400" /> {msg.email}
                        </span>
                        <span className="text-slate-600 flex items-center gap-2">
                          <Phone className="w-3 h-3 text-slate-400" /> {msg.phone}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-slate-700 text-sm whitespace-pre-wrap max-w-md">
                        {msg.message}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end gap-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar className="w-3 h-3" /> {new Date(msg.date).toLocaleDateString()}
                        </span>
                        <span>{new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
