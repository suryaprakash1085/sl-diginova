import { PublicLayout } from "./PublicLayout";
import { AdminLayout } from "./AdminLayout";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export function PlaceholderPage({ title, isAdmin = false }: { title: string; isAdmin?: boolean }) {
  const navigate = useNavigate();
  const Layout = isAdmin ? AdminLayout : PublicLayout;

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
        <p className="text-slate-500 max-w-md mb-8">
          This page is currently under development. Use the chat to ask Fusion to implement the full functionality for this specific page!
        </p>
        <Button onClick={() => navigate(-1)} variant="outline">
          Go Back
        </Button>
      </div>
    </Layout>
  );
}
