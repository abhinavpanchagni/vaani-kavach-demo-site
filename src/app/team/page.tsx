"use client";

import { User, Code, FileText, Database, Share2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TeamPage() {
  const placeholders = [1, 2, 3, 4, 5, 6];

  return (
    <div className="container mx-auto px-4 py-24 max-w-5xl space-y-24 min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center px-3 py-1 mb-2 text-xs font-medium border rounded-full border-white/10 text-muted-foreground bg-white/[0.02] uppercase tracking-widest">
          Team 4LPA.exe
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">The Architects Behind Vaani Kavach</h1>
        <p className="text-lg text-muted-foreground font-light leading-relaxed">
          Building the future of voice integrity and transaction protection for SIH 2026.
        </p>
      </div>

      {/* Team Members Grid */}
      <section>
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
          <User className="w-5 h-5 text-foreground/70" />
          <h2 className="text-xl font-medium tracking-tight">Meet the Team</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {placeholders.map((idx) => (
            <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors">
              <div className="aspect-[4/3] bg-[#0A0A0A] flex items-center justify-center border-b border-white/5">
                <span className="text-muted-foreground/30 text-xs tracking-widest uppercase">[Photo {idx}]</span>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-medium text-foreground">[Name Placeholder]</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">[Role Placeholder]</p>
                <p className="text-sm text-muted-foreground/80 font-light mt-4 leading-relaxed line-clamp-2">
                  [Brief bio or primary contribution placeholder.]
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Project Details */}
      <section className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <Share2 className="w-5 h-5 text-foreground/70" />
            <h2 className="text-xl font-medium tracking-tight">Project Architecture</h2>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              [Placeholder] Detailed system architecture showing the call audio stream connecting to the inference engine and Action Protection API.
            </p>
            <div className="aspect-video bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-center">
              <span className="text-muted-foreground/30 text-xs tracking-widest uppercase">[Diagram Placeholder]</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <Database className="w-5 h-5 text-foreground/70" />
            <h2 className="text-xl font-medium tracking-tight">Research & Evaluation</h2>
          </div>
          <div className="space-y-8">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Datasets & References</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                [Placeholder: List dataset references and research papers used for model training.]
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Evaluation Results</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                [Placeholder: Add evaluation metrics like EER, accuracy, and latency once finalized.]
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Resources & Links */}
      <section className="border-t border-white/5 pt-16 grid md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Code className="w-5 h-5 text-foreground/70" />
            <h2 className="text-xl font-medium tracking-tight">Repository</h2>
          </div>
          <p className="text-muted-foreground text-sm font-light">
            Explore our source code and technical documentation.
          </p>
          <Button variant="outline" className="gap-2 bg-transparent border-white/10 hover:bg-white/[0.02]" disabled>
            <Code className="w-4 h-4" /> [Link Placeholder]
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-foreground/70" />
            <h2 className="text-xl font-medium tracking-tight">Fraud Awareness</h2>
          </div>
          <p className="text-muted-foreground text-sm font-light">
            Learn more about how voice-cloning fraud operates and how to protect yourself.
          </p>
          <Button variant="outline" className="gap-2 bg-transparent border-white/10 hover:bg-white/[0.02]" disabled>
            <FileText className="w-4 h-4" /> [Material Placeholder]
          </Button>
        </div>
      </section>
    </div>
  );
}
