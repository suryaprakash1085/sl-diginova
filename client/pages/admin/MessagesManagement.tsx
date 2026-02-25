import { AdminLayout } from "@/components/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { ContactMessage } from "@shared/api";
import { MessageSquare, Mail, Phone, Calendar, User } from "lucide-react";
import { ResponsiveTable, TableColumn } from "@/components/ResponsiveTable";

export default function MessagesManagement() {
  const { data: messages = [], isLoading } = useQuery<ContactMessage[]>({
    queryKey: ["messages"],
    queryFn: async () => {
      const res = await fetch("/api/messages");
      return res.json();
    },
  });

  const columns: TableColumn<ContactMessage>[] = [
    {
      key: "sender",
      label: "Sender",
      className: "w-[200px]",
      render: (msg) => (
        <span className="font-semibold text-slate-900 flex items-center gap-2">
          <User className="w-3 h-3 text-slate-400" /> {msg.name}
        </span>
      ),
    },
    {
      key: "contact",
      label: "Contact Info",
      render: (msg) => (
        <div className="flex flex-col gap-1 text-sm">
          <span className="text-slate-600 flex items-center gap-2">
            <Mail className="w-3 h-3 text-slate-400" /> {msg.email}
          </span>
          
        </div>
      ),
    },
    {
      key: "message",
      label: "Message",
      render: (msg) => (
        <p className="text-slate-700 text-sm whitespace-pre-wrap max-w-md">
          {msg.message}
        </p>
      ),
    },
    {
      key: "date",
      label: "Received Date",
      className: "text-right",
      render: (msg) => (
        <div className="flex flex-col items-end gap-1 text-xs text-slate-400">
          <span className="flex items-center gap-1 font-medium">
            <Calendar className="w-3 h-3" /> {new Date(msg.date).toLocaleDateString()}
          </span>
          <span>{new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      ),
    },
  ];

  const renderMobileCard = (msg: ContactMessage) => (
    <div className="bg-white rounded-lg border p-4 space-y-3">
      <div>
        <p className="font-semibold text-slate-900 flex items-center gap-2">
          <User className="w-4 h-4 text-slate-400" /> {msg.name}
        </p>
        <div className="flex flex-col gap-1 text-sm text-slate-600 mt-2">
          <span className="flex items-center gap-2">
            <Mail className="w-3 h-3 text-slate-400" /> {msg.email}
          </span>
          <span className="flex items-center gap-2">
            <Phone className="w-3 h-3 text-slate-400" /> {msg.phone}
          </span>
        </div>
      </div>
      <div className="border-t pt-3">
        <p className="text-sm text-slate-700 whitespace-pre-wrap">{msg.message}</p>
      </div>
      <div className="flex items-center gap-1 text-xs text-slate-400">
        <Calendar className="w-3 h-3" /> {new Date(msg.date).toLocaleDateString()} {new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );

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
          <ResponsiveTable
            columns={columns}
            data={messages}
            keyField="id"
            isLoading={isLoading}
            isEmpty={messages.length === 0}
            emptyMessage="No messages found"
            renderMobileCard={renderMobileCard}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
