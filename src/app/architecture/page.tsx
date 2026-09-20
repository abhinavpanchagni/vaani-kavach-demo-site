"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, Phone, Network, Activity, CheckCircle2, ShieldAlert, FileKey, Lock, ShieldCheck, ArrowLeft } from "lucide-react";
import { explanations } from "@/config/explanations";
import { TechnicalExplanation } from "@/components/TechnicalExplanation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const architectureNodes = [
  { id: "call", icon: <Phone className="w-5 h-5" />, data: explanations.call },
  { id: "processing", icon: <Network className="w-5 h-5" />, data: explanations.processing },
  { id: "detection", icon: <Activity className="w-5 h-5" />, data: explanations.detection },
  { id: "verification", icon: <CheckCircle2 className="w-5 h-5" />, data: explanations.verification },
  { id: "risk", icon: <ShieldAlert className="w-5 h-5" />, data: explanations.risk },
  { id: "receipt", icon: <FileKey className="w-5 h-5" />, data: explanations.receipt },
  { id: "payment", icon: <Lock className="w-5 h-5" />, data: explanations.payment },
  { id: "privacy", icon: <ShieldCheck className="w-5 h-5" />, data: explanations.privacy },
];

export default function ArchitecturePage() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const activeData = architectureNodes.find(n => n.id === activeNode)?.data;

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl space-y-16 min-h-[calc(100vh-4rem)]">
      <div className="flex justify-between items-center max-w-2xl mx-auto mb-12">
        <Link href="/simulation">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground pl-0">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Experience
          </Button>
        </Link>
      </div>
      
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">System Architecture</h1>
        <p className="text-muted-foreground font-light leading-relaxed text-lg">
          Explore the engineering behind the Vaani Kavach experience.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        {/* Diagram Column */}
        <div className="flex flex-col items-center">
          {architectureNodes.map((node, idx) => (
            <div key={node.id} className="flex flex-col items-center w-full max-w-sm">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveNode(node.id)}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  activeNode === node.id 
                    ? "bg-white/10 border-white/20 text-foreground shadow-lg" 
                    : "bg-white/[0.02] border-white/10 hover:border-white/20 text-foreground/80 cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${activeNode === node.id ? "bg-white/10" : "bg-white/5"}`}>
                    {node.icon}
                  </div>
                  <span className="font-medium text-sm">{node.data.title}</span>
                </div>
              </motion.button>
              
              {idx < architectureNodes.length - 1 && (
                <div className="py-2 text-muted-foreground/30">
                  <ArrowDown className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Explanation Column */}
        <div className="sticky top-24">
          <AnimatePresence mode="wait">
            {activeData ? (
              <motion.div
                key={activeNode}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold tracking-tight text-foreground">Module Details</h3>
                </div>
                <TechnicalExplanation data={activeData} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-[200px] border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-center p-8 bg-white/[0.01]"
              >
                <Network className="w-8 h-8 text-muted-foreground/30 mb-4" />
                <p className="text-sm text-muted-foreground font-light">Select a highlighted module to view technical details.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
