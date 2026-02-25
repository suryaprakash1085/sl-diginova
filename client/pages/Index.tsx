import { PublicLayout } from "@/components/PublicLayout";
import { useSettings } from "@/hooks/use-settings";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  const { getSetting, isLoading } = useSettings();

  if (isLoading) return null;

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)]" />
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            {getSetting("banner_title")}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            {getSetting("banner_description")}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/products">
              <Button size="lg" className="px-8 h-12 text-base font-semibold gap-2 shadow-lg shadow-primary/20">
                {getSetting("button_text")} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg" className="px-8 h-12 text-base font-semibold">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Fast Performance</h3>
              <p className="text-slate-600">Experience lightning-fast speeds across all our platforms and services.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Secure by Design</h3>
              <p className="text-slate-600">Your security is our top priority. We use industry-standard encryption.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Premium Quality</h3>
              <p className="text-slate-600">We deliver only the best quality products and services to our customers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Content Section */}
      <section className="py-20 bg-slate-50 border-y">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Built for Excellence</h2>
          <p className="text-slate-600 mb-8 italic">
            "We believe in creating products that make a difference in people's lives every single day."
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-slate-200" />
            <div className="text-left">
              <p className="text-sm font-bold text-slate-900">John Doe</p>
              <p className="text-xs text-slate-500">CEO, {getSetting("company_name")}</p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
