import { useQuery } from "@tanstack/react-query";
import { DashboardSummary } from "@shared/api";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Package, MessageSquare, TrendingUp, ArrowUpRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: summary, isLoading } = useQuery<DashboardSummary>({
    queryKey: ["dashboard-summary"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard-summary");
      const json = await res.json();
      return json.data;
    },
  });

  const stats = [
    { label: "Total Users", value: summary?.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Products", value: summary?.totalProducts, icon: Package, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Contact Messages", value: summary?.totalMessages, icon: MessageSquare, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
          <p className="text-slate-500 mt-2">Overview of your application's current state.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat, i) => (
            <Card key={i} className="border-slate-200/60 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">{stat.label}</CardTitle>
                <div className={`${stat.bg} p-2 rounded-lg`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                )}
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  <span className="text-emerald-500 font-medium">+12%</span> from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 border-slate-200/60 shadow-sm">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
           <CardContent>
  <div className="space-y-4">
    {[
      { id: 1, type: "user", text: "New user registered" },
      { id: 2, type: "product", text: "New product added", },
      { id: 3, type: "message", text: "New contact message"},
    ].map((activity, i) => {
      // Determine route based on activity type
      let route = "";
      if (activity.type === "user") route = "/admin/users";
      if (activity.type === "product") route = "/admin/products";
      if (activity.type === "message") route = "/admin/messages";

      return (
        <div
          key={i}
          className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
            {i + 1}
          </div>
          <div className="flex-grow">
            <p className="text-sm font-medium text-slate-900">{activity.text}</p>
            <p className="text-xs text-slate-500">{activity.time}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = route} // navigate to correct route
          >
            <ArrowUpRight className="w-4 h-4" />
          </Button>
        </div>
      );
    })}
  </div>
</CardContent>
          </Card>

          <Card className="col-span-3 border-slate-200/60 shadow-sm">
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 font-medium">Server Load</span>
                    <span className="text-slate-900 font-bold">42%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[42%]"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 font-medium">Storage Used</span>
                    <span className="text-slate-900 font-bold">18%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[18%]"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
