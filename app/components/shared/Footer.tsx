import Image from "next/image";
import Link from "next/link";
import { HeartPulse } from "lucide-react";

const team = [
  { name: "Zubair Mubarak Ayomiposi", role: "Founder" },
  { name: "AbdulKabir Sultan", role: "Co-Founder" },
  { name: "Badmus Eniola", role: "Software Engineer" },
];

interface FooterProps {
  hideLinks?: boolean;
}

export function Footer({ hideLinks = false }: FooterProps) {
  return (
    <footer className="bg-ink text-white/80">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-3 gap-10">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt="MamaConnect"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <div className="flex flex-col">
                <span className="inline-flex items-baseline text-lg font-bold text-white leading-tight whitespace-nowrap">
                  Mama<span className="text-primary">Connect</span>
                </span>
                <span className="text-[10px] text-white/40 uppercase tracking-wider">
                  Maternal Health Platform
                </span>
              </div>
            </Link>
            <p className="text-[15px] text-white/50 leading-relaxed max-w-sm">
              Human-centered maternal health platform connecting mothers to life-saving care through community health workers and technology.
            </p>
          </div>

          {!hideLinks && (
            <div>
              <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">Quick Links</h3>
              <ul className="space-y-2.5">
                {[
                  { label: "Home", href: "/" },
                  { label: "For Mothers", href: "/mothers" },
                  { label: "For CHEWs", href: "/chew" },
                  { label: "Organizations", href: "/organizations" },
                  { label: "Healthcare", href: "/healthcare" },
                  { label: "About", href: "/about" },
                  { label: "FAQ", href: "/faq" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[15px] text-white/50 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">Team MamaConnect</h3>
            <ul className="space-y-3">
              {team.map((member) => (
                <li key={member.name}>
                  <p className="text-[15px] font-medium text-white/90">{member.name}</p>
                  <p className="text-sm text-white/40">{member.role}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[13px] text-white/30">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>MamaConnect — CareCode Hackathon 2026</span>
          </div>
          <p className="text-[13px] text-white/30">
            &copy; {new Date().getFullYear()} MamaConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
