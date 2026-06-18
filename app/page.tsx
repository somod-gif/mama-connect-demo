import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Problem from "./components/Problem";
import ProblemBreakdown from "./components/ProblemBreakdown";
import Solution from "./components/Solution";
import HowItWorks from "./components/HowItWorks";
import UserStory from "./components/UserStory";
import Features from "./components/Features";
import HelpMumAlignment from "./components/HelpMumAlignment";
import Technology from "./components/Technology";
import Impact from "./components/Impact";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <Problem />
      <ProblemBreakdown />
      <Solution />
      <HowItWorks />
      <UserStory />
      <Features />
      <HelpMumAlignment />
      <Technology />
      <Impact />
      <CTA />
      <Footer />
    </main>
  );
}