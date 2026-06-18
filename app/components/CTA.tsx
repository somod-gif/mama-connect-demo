"use client";

import { motion } from "framer-motion";
import { ChevronRight, Play, Heart } from "lucide-react";

export default function CTA() {
  return (
    <section id="demo" className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 gradient-green-blue opacity-95" />
      <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-white/10 rounded-full" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
            No Woman Should Die Because Help Arrived Too Late.
          </h2>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            MamaConnect helps mothers, healthcare workers, and healthcare
            facilities work together to improve maternal health outcomes.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-emerald-700 font-bold bg-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <Play className="w-5 h-5" />
              Explore Demo
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-white font-semibold border-2 border-white/30 rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300"
            >
              Learn More
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}