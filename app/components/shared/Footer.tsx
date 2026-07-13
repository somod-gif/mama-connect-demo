import Image from "next/image";
import Link from "next/link";

const team = [
  { name: "Zubair Mubarak Ayomiposi", role: "Medical Student & AI/ML Engineer" },
  { name: "AbdulKabir Sultan", role: "Software Engineer" },
  { name: "Badmus Eniola", role: "Software Engineer" },
];

interface FooterProps { hideLinks?: boolean; }

export function Footer({ hideLinks = false }: FooterProps) {
  return (
    <footer className="bg-secondary text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="MamaConnect"
                width={44}
                height={44}
                className="rounded-xl brightness-0 invert"
              />
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-white leading-tight">
                  Mama<span className="text-primary">Connect</span>
                </span>
                <span className="text-[11px] text-white/50 leading-tight tracking-wide uppercase">
                  Maternal Health Platform
                </span>
              </div>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed max-w-sm">
              Human-Centered Maternal Health Platform. Connecting mothers to life-saving care through community health workers and technology.
            </p>
          </div>

          {!hideLinks && (
            <div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h3>
              <ul className="space-y-2.5">
                <li><Link href="/" className="text-sm text-white/60 hover:text-primary transition-colors">Home</Link></li>
                <li><Link href="/mothers" className="text-sm text-white/60 hover:text-primary transition-colors">For Mothers</Link></li>
                <li><Link href="/chew" className="text-sm text-white/60 hover:text-primary transition-colors">For CHEWs</Link></li>
                <li><Link href="/about" className="text-sm text-white/60 hover:text-primary transition-colors">About</Link></li>
                <li><Link href="/faq" className="text-sm text-white/60 hover:text-primary transition-colors">FAQ</Link></li>
              </ul>
            </div>
          )}

          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Team MamaConnect</h3>
            <ul className="space-y-3">
              {team.map((member) => (
                <li key={member.name}>
                  <p className="text-sm font-medium text-white/90">{member.name}</p>
                  <p className="text-xs text-white/50">{member.role}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-center text-xs text-white/40">
            &copy; {new Date().getFullYear()} MamaConnect. Human-Centered Maternal Health Platform.
          </p>
        </div>
      </div>
    </footer>
  );
}
