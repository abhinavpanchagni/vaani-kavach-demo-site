"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, Network, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const cards = [
  {
    title: "Experience It",
    description: "Step into a realistic voice-impersonation incident. See how Vaani Kavach protects a customer during an active call.",
    icon: <Play className="w-5 h-5 text-foreground/80" />,
    cta: "Start Scenario",
    href: "/simulation",
  },
  {
    title: "Understand It",
    description: "Explore the engineering behind the scenes. Dive into the system architecture and integration components.",
    icon: <Network className="w-5 h-5 text-foreground/80" />,
    cta: "View Architecture",
    href: "/architecture",
  },
  {
    title: "Test It",
    description: "Access the technical workbench. Test the core voice models and API exchanges directly.",
    icon: <ShieldCheck className="w-5 h-5 text-foreground/80" />,
    cta: "Open Workbench",
    href: "/try-model",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-background">
      <div className="container px-4 py-24 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-[10px] uppercase tracking-widest font-medium border rounded-full border-white/10 text-muted-foreground bg-white/[0.02]">
            SIH 2026 Demonstration
          </div>
          <h1 className="mb-6 text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
            From Voice Integrity to Action Protection.
          </h1>
          <p className="text-xl text-muted-foreground font-light leading-relaxed">
            Vaani Kavach analyzes suspicious calls and intercepts fraudulent transactions before they happen.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid gap-6 md:grid-cols-3"
        >
          {cards.map((card, index) => (
            <Link key={card.title} href={card.href} className="group">
              <Card className="h-full flex flex-col bg-white/[0.01] border-white/10 group-hover:bg-white/[0.02] group-hover:border-white/20 transition-all shadow-none rounded-xl">
                <CardHeader className="pb-4">
                  <div className="mb-4 w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 border border-white/10">
                    {card.icon}
                  </div>
                  <CardTitle className="text-lg font-medium tracking-tight">{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="mt-auto flex flex-col gap-8">
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground font-light">
                    {card.description}
                  </CardDescription>
                  <div className="flex items-center text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                    {card.cta}
                    <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
