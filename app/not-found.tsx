import Link from "next/link";
import { Zap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600">
          <Zap className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-5xl font-extrabold gradient-twende-text mb-4">404</h1>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Page not found</h2>
        <p className="text-slate-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or the business may be inactive.
        </p>
        <Link href="/">
          <Button size="lg">
            <ArrowLeft className="h-4 w-4" />
            Back to Twende
          </Button>
        </Link>
      </div>
    </div>
  );
}
