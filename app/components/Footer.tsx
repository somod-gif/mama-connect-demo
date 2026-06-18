import { Baby, Heart } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "#" },
  { label: "Solution", href: "#solution" },
  { label: "Impact", href: "#impact" },
  { label: "Technology", href: "#technology" },
  { label: "Demo", href: "#demo" },
];

const team = [
  {
    name: "Zubair Mubarak Ayomiposi",
    role: "Medical Student & AI/ML Engineer",
  },
  {
    name: "AbdulKabir Sultan",
    role: "Software Engineer",
  },
  {
    name: "Badmus Eniola",
    role: "Software Engineer",
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Logo & Tagline */}
          <div className="space-y-4">
            <a href="#" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl gradient-green-blue flex items-center justify-center shadow-lg">
                <Baby className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Mama<span className="text-emerald-400">Connect</span>
              </span>
            </a>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Human-Centered, AI-Assisted Maternal Health Platform
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Team */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Team MamaConnect
            </h3>
            <ul className="space-y-3">
              {team.map((member) => (
                <li key={member.name}>
                  <p className="text-sm font-medium text-slate-300">
                    {member.name}
                  </p>
                  <p className="text-xs text-slate-500">{member.role}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <p className="text-center text-xs text-slate-500">
            &copy; 2026 MamaConnect. Built for HelpMum CareCode Hackathon.
          </p>
        </div>
      </div>
    </footer>
  );
}