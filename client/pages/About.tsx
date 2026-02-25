import { PublicLayout } from "@/components/PublicLayout";
import { useSettings } from "@/hooks/use-settings";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Info, Target, Eye, Users } from "lucide-react";

export default function About() {
  const { getSetting, isLoading } = useSettings();

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container mx-auto py-20 px-4 space-y-12">
          <Skeleton className="h-12 w-64 mx-auto" />
          <div className="grid md:grid-cols-2 gap-12">
            <Skeleton className="h-64 rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="bg-slate-50 py-20 border-b">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">About Us</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {getSetting("company_description") || "Learn more about our company, our mission, and the team behind our success."}
          </p>
        </div>
      </div>

      <div className="container mx-auto py-20 px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-none shadow-md bg-white hover:shadow-lg transition-shadow">
            <CardContent className="pt-8 text-center space-y-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Our Mission</h3>
              <p className="text-slate-600 leading-relaxed">
                {getSetting("mission") || "To provide high-quality products that empower our users."}
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white hover:shadow-lg transition-shadow">
            <CardContent className="pt-8 text-center space-y-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Our Vision</h3>
              <p className="text-slate-600 leading-relaxed">
                {getSetting("vision") || "To be the leading innovator in our industry globally."}
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white hover:shadow-lg transition-shadow">
            <CardContent className="pt-8 text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Our Team</h3>
              <p className="text-slate-600 leading-relaxed">
                {getSetting("team_details") || "A dedicated group of professionals working together to achieve excellence."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Dynamic Keys Illustration */}
        <div className="mt-20 p-8 bg-slate-900 rounded-2xl text-white">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose Us?</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-6 h-6 bg-primary rounded-full flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold">Innovation</h4>
                    <p className="text-slate-400 text-sm">We constantly push the boundaries of what's possible.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 bg-primary rounded-full flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold">Quality</h4>
                    <p className="text-slate-400 text-sm">Every product is crafted with precision and care.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <p className="italic text-slate-300">
                "{getSetting("about_quote") || "Quality is not an act, it is a habit."}"
              </p>
              <p className="mt-4 font-bold text-primary">— {getSetting("company_name")}</p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
