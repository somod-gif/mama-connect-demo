import Link from "next/link";
import { HeartPulse } from "lucide-react";
import { Button } from "@/app/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-6">
          <HeartPulse className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-4xl font-bold text-foreground mb-3 tracking-tight">
          Page not found
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>

        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </main>
  );
}
