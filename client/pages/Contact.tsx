import { PublicLayout } from "@/components/PublicLayout";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { useSettings } from "@/hooks/use-settings";

export default function Contact() {
  const { getSetting } = useSettings();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name, email, phone, message });
  };

  return (
    <PublicLayout>
      <div className="bg-slate-50 py-20 border-b">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Contact Us</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Have questions or want to collaborate? Reach out to us using the form below or via our contact details.
          </p>
        </div>
      </div>

      <div className="container mx-auto py-20 px-4">
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-900">Get in Touch</h2>
            <p className="text-slate-600 leading-relaxed">
              We're here to help and answer any question you might have. We look forward to hearing from you!
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Email Us</h4>
                  <p className="text-slate-500 text-sm">{getSetting("company_email") || "info@example.com"}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Call Us</h4>
                  <p className="text-slate-500 text-sm">{getSetting("company_phone") || "+1 (234) 567-890"}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Visit Us</h4>
                  <p className="text-slate-500 text-sm">{getSetting("company_address") || "123 Business St, City, Country"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="border-none shadow-xl shadow-slate-200/50 bg-white p-2">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Send a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll reply within 24 hours.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="john@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (234) 567-890" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} required rows={5} placeholder="How can we help you?" />
                </div>
                <Button type="submit" className="w-full gap-2 h-11 font-bold shadow-lg shadow-primary/20" disabled={mutation.isPending}>
                  {mutation.isPending ? "Sending..." : "Send Message"} <Send className="w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}
