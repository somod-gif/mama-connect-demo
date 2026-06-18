import {
  ClipboardList,
  MessageCircle,
  Smartphone,
  Activity,
  BookOpen,
  Building,
  LayoutDashboard,
  Globe,
  Phone,
  Baby,
  Heart,
  Bell,
  ChevronRight,
} from "lucide-react";

const features = [
  {
    icon: ClipboardList,
    label: "Electronic Health Records",
    color: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp Chatbot",
    color: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: Smartphone,
    label: "USSD Support",
    color: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Activity,
    label: "Risk Monitoring",
    color: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    icon: BookOpen,
    label: "Educational Library",
    color: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  {
    icon: Building,
    label: "Healthcare Referrals",
    color: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    icon: LayoutDashboard,
    label: "Community Health Worker Dashboard",
    color: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    icon: Globe,
    label: "Multilingual Support",
    color: "bg-teal-100",
    iconColor: "text-teal-600",
  },
  {
    icon: Phone,
    label: "Interactive Voice Response",
    color: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    icon: Baby,
    label: "Pregnancy Tracking",
    color: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  {
    icon: Heart,
    label: "Postnatal Support",
    color: "bg-rose-100",
    iconColor: "text-rose-600",
  },
  {
    icon: Bell,
    label: "Emergency Escalation",
    color: "bg-red-100",
    iconColor: "text-red-600",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Everything Needed For Maternal Care Coordination
          </h2>
          <p className="text-lg text-slate-600">
            A comprehensive suite of tools designed for every aspect of maternal
            healthcare delivery.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {features.map((feature) => (
            <div
              key={feature.label}
              className="group flex items-start gap-4 p-5 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 card-hover"
            >
              <div
                className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center flex-shrink-0`}
              >
                <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 leading-snug">
                  {feature.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}