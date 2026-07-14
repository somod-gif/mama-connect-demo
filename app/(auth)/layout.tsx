import { Footer } from "@/app/components/shared/Footer";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background-soft">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </div>
      <Footer hideLinks />
    </div>
  );
}
