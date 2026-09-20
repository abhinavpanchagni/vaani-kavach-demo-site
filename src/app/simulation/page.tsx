"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, PhoneCall, ShieldCheck, ShieldAlert, Fingerprint, Lock, Activity, Mic, MicOff, Grid3x3, Volume2, VolumeX, ArrowRight, Play, RefreshCw, FileKey, CheckCircle2 } from "lucide-react";
import { scenarioConfig } from "@/config/scenario";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const STAGES = ["INCOMING", "ACTIVE CALL", "VERIFICATION", "PAYMENT", "PROTECTION"];

export default function SimulationPage() {
  const [stageIndex, setStageIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [viewWhy, setViewWhy] = useState(false);
  
  // Verification Sequence State
  const [verificationStep, setVerificationStep] = useState(0);
  
  // Payment Sequence State
  const [paymentStep, setPaymentStep] = useState(0);

  // Voice Announcements State
  const [announcementsMuted, setAnnouncementsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const currentStage = STAGES[stageIndex];
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  
  const nextStage = () => {
    setStageIndex(s => Math.min(s + 1, STAGES.length - 1));
    setShowAlert(false);
    setViewWhy(false);
    setVerificationStep(0);
    setPaymentStep(0);
  };
  
  const restart = () => {
    setStageIndex(0);
    setCurrentTime(0);
    setShowAlert(false);
    setViewWhy(false);
    setVerificationStep(0);
    setPaymentStep(0);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const skipToAlert = () => {
    setCurrentTime(25);
    setShowAlert(true);
  };

  const replayConversation = () => {
    setCurrentTime(0);
    setShowAlert(false);
    setViewWhy(false);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const startVerificationSequence = () => {
    setVerificationStep(1);
    setTimeout(() => setVerificationStep(2), 2000); // Generate digits & wait for response
    setTimeout(() => setVerificationStep(3), 3500); // Show response outcome
  };

  const startPaymentSequence = () => {
    setPaymentStep(1);
    setTimeout(() => setPaymentStep(2), 1500); // Step 1: Call Risk
    setTimeout(() => setPaymentStep(3), 3000); // Step 2: Risk Receipt
    setTimeout(() => setPaymentStep(4), 4500); // Step 3: Action Protection
    setTimeout(() => nextStage(), 7000);       // Move to final stage
  };

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    if (announcementsMuted) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find(v => v.lang.includes('en-IN') || v.name.includes('India'));
    if (indianVoice) {
      utterance.voice = indianVoice;
    } else {
      const englishVoice = voices.find(v => v.lang.startsWith('en'));
      if (englishVoice) utterance.voice = englishVoice;
    }
    
    utterance.rate = 0.95; 
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  }, [announcementsMuted]);

  // Voice Announcement 1: Joining
  useEffect(() => {
    if (currentStage === "ACTIVE CALL" && !showAlert && currentTime === 0) {
      speak("Vaani Kavach has joined your call as a security monitor.");
    }
  }, [currentStage, speak, showAlert, currentTime]);

  // Voice Announcement 2: Security Alert
  useEffect(() => {
    if (currentStage === "ACTIVE CALL" && showAlert) {
      speak("Security alert. Please verify this caller before transferring money.");
    }
  }, [showAlert, currentStage, speak]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Simulate audio playback timing in active call
  useEffect(() => {
    if (currentStage === "ACTIVE CALL" && !showAlert) {
      const interval = setInterval(() => {
        setCurrentTime(t => {
          const nextTime = t + 1;
          if (nextTime === 25) {
            setShowAlert(true);
          }
          return Math.min(nextTime, 60);
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentStage, showAlert]);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentTime]);

  const toggleMuteAnnouncements = () => {
    setAnnouncementsMuted(!announcementsMuted);
    if (!announcementsMuted && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const renderProgress = () => (
    <div className="w-full max-w-2xl mx-auto mb-10 pt-6">
      <div className="flex justify-between items-center relative px-2">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -z-10" />
        <motion.div 
          className="absolute top-1/2 left-0 h-[1px] bg-foreground/50 -z-10 origin-left" 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: stageIndex / (STAGES.length - 1) }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        {STAGES.map((s, i) => (
          <div key={s} className="flex flex-col items-center gap-2 bg-background px-2">
            <div className={`w-1.5 h-1.5 rounded-full transition-colors ${stageIndex >= i ? "bg-foreground" : "bg-white/20"}`} />
            <span className={`text-[9px] tracking-widest uppercase font-medium ${stageIndex >= i ? "text-foreground" : "text-muted-foreground/40"}`}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] font-sans text-foreground pb-12 selection:bg-white/10 relative">
      
      {/* Voice Announcements Toggle */}
      <div className="absolute top-6 right-4 sm:right-8 z-10">
        <Button 
          variant="outline" 
          size="sm" 
          className="border-white/10 bg-transparent hover:bg-white/[0.02] text-muted-foreground gap-2 h-8 text-xs"
          onClick={toggleMuteAnnouncements}
        >
          {announcementsMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{announcementsMuted ? "Voice Muted" : "Voice On"}</span>
        </Button>
      </div>

      <div className="container mx-auto px-4 max-w-5xl flex-1 flex flex-col">
        {renderProgress()}

        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <AnimatePresence mode="wait">

            {/* STAGE 1: INCOMING CALL */}
            {currentStage === "INCOMING" && (
              <motion.div key="incoming" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="w-full max-w-sm space-y-6">
                <div className="text-center space-y-2 mb-4">
                  <Badge variant="outline" className="border-red-500/20 text-red-500 bg-red-500/5 uppercase tracking-widest text-[10px]">Customer Perspective</Badge>
                  <p className="text-muted-foreground text-sm font-light">You are receiving a call from someone claiming to be your bank.</p>
                </div>

                <div className="aspect-[9/16] bg-[#0A0A0C] border border-white/5 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden relative">
                  <div className="flex-1 flex flex-col items-center justify-center space-y-6 pt-12">
                    <div className="w-24 h-24 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center">
                      <Phone className="w-10 h-10 text-muted-foreground/30" />
                    </div>
                    <div className="text-center space-y-1">
                      <h2 className="text-2xl font-medium tracking-tight text-foreground/90">Bank Representative</h2>
                      <p className="text-sm text-muted-foreground">Incoming Call...</p>
                      <p className="text-[11px] text-muted-foreground/40 font-mono mt-2">+91 98765 43210</p>
                    </div>
                  </div>

                  <div className="pb-16 px-12 flex justify-between items-center w-full">
                    <button className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20 hover:bg-red-500/20 transition-colors">
                      <PhoneOff className="w-6 h-6 fill-current" />
                    </button>
                    <button onClick={nextStage} className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors shadow-[0_0_20px_rgba(34,197,94,0.2)] group">
                      <PhoneCall className="w-6 h-6 fill-current group-hover:animate-bounce" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STAGE 2: ACTIVE CALL */}
            {currentStage === "ACTIVE CALL" && (
              <motion.div key="active-call" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md mx-auto space-y-4">
                
                <div className="flex justify-between items-center px-2">
                  <span className="text-xs text-muted-foreground font-light">Simulated Scenario</span>
                  {!showAlert && (
                     <Button variant="ghost" size="sm" onClick={skipToAlert} className="h-8 text-xs text-muted-foreground hover:text-foreground">
                       Skip to Security Alert <Play className="w-3 h-3 ml-1.5" />
                     </Button>
                  )}
                </div>

                <div className="aspect-[9/16] bg-[#0A0A0C] border border-white/5 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden relative">
                  
                  {/* Top Bar */}
                  <div className="pt-8 pb-4 flex flex-col items-center border-b border-white/5 bg-white/[0.01]">
                    <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-3">
                      <Phone className="w-6 h-6 text-muted-foreground/50" />
                    </div>
                    <h3 className="font-medium text-foreground/90">Bank Representative</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono text-muted-foreground">
                        {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(0).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {/* Vaani Kavach Status Bar */}
                  <div className="px-4 py-3 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className={`w-4 h-4 ${currentTime > 10 ? 'text-amber-500' : 'text-green-500'}`} />
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60">Monitoring</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isSpeaking && (
                        <div className="flex items-center gap-1 mr-2">
                          <motion.div className="w-1 h-1 rounded-full bg-blue-500" animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} />
                          <motion.div className="w-1 h-1 rounded-full bg-blue-500" animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                          <motion.div className="w-1 h-1 rounded-full bg-blue-500" animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                        </div>
                      )}
                      <span className={`text-xs font-mono ${currentTime > 10 ? 'text-amber-500' : 'text-green-500'}`}>
                        {currentTime > 10 ? 'Analyzing Risk...' : 'Secure'}
                      </span>
                    </div>
                  </div>

                  {/* Scrolling Transcript */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#050505]">
                    <div className="text-center mb-4">
                      <span className="text-[10px] text-muted-foreground/40 uppercase tracking-widest bg-white/[0.02] px-2 py-1 rounded">Simulated Transcript</span>
                    </div>
                    {scenarioConfig.captions.map((cap, i) => (
                      currentTime >= cap.start && (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, y: 10 }} 
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex flex-col ${cap.speaker === 'bank' ? 'items-start' : 'items-end'}`}
                        >
                          <span className="text-[10px] text-muted-foreground/50 mb-1 ml-1">{cap.speaker === 'bank' ? 'Caller' : 'You'}</span>
                          <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
                            cap.speaker === 'bank' 
                              ? 'bg-white/10 text-foreground/90 rounded-tl-sm' 
                              : 'bg-blue-600 text-white rounded-tr-sm'
                          }`}>
                            {cap.text}
                          </div>
                        </motion.div>
                      )
                    ))}
                    <div ref={transcriptEndRef} />
                  </div>

                  {/* Call Controls */}
                  <div className="p-6 bg-white/[0.01] border-t border-white/5 flex justify-around items-center">
                    <button onClick={() => setIsMuted(!isMuted)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isMuted ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'}`}>
                      {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                    <button className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                      <Grid3x3 className="w-5 h-5" />
                    </button>
                    <button className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <button className="w-12 h-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center border border-red-500/20 hover:bg-red-500/30">
                      <PhoneOff className="w-5 h-5 fill-current" />
                    </button>
                  </div>

                  {/* SECURITY ALERT OVERLAY */}
                  <AnimatePresence>
                    {showAlert && (
                      <motion.div 
                        initial={{ opacity: 0, y: "100%" }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: "100%" }}
                        className="absolute inset-x-0 bottom-0 top-0 bg-[#050505]/95 backdrop-blur-xl flex flex-col p-6 pt-16 z-20 overflow-y-auto"
                      >
                        <div className="flex flex-col items-center text-center space-y-4 mb-8">
                          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                            <ShieldAlert className="w-8 h-8 text-amber-500" />
                          </div>
                          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Action Recommended</h2>
                          <p className="text-foreground/80 text-base leading-relaxed max-w-xs font-medium">
                            Please verify this caller before transferring money.
                          </p>
                        </div>

                        <div className="w-full bg-[#0A0A0C] border border-white/5 rounded-xl p-4 space-y-4 mb-8">
                          <div className="flex items-center justify-between border-b border-white/5 pb-3">
                            <span className="text-sm text-muted-foreground">Voice Evidence</span>
                            <span className="text-sm font-medium text-amber-500">Suspicious (Simulated)</span>
                          </div>
                          <div className="flex items-center justify-between pb-1">
                            <span className="text-sm text-muted-foreground">Caller Identity</span>
                            <span className="text-sm font-medium text-amber-500">Unverified</span>
                          </div>

                          <div className="pt-2 border-t border-white/5">
                            <button 
                              onClick={() => setViewWhy(!viewWhy)} 
                              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 w-full text-center py-2"
                            >
                              {viewWhy ? "Hide Timeline" : "View Why"}
                            </button>
                            
                            <AnimatePresence>
                              {viewWhy && (
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }} 
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden mt-4 space-y-4"
                                >
                                  <div className="pl-3 border-l-2 border-white/10 space-y-4">
                                    <div className="relative">
                                      <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-white/20" />
                                      <p className="text-xs font-medium">Payment Request Detected</p>
                                      <p className="text-[11px] text-muted-foreground">Simulated caller asked for ₹25,000 transfer.</p>
                                    </div>
                                    <div className="relative">
                                      <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-amber-500" />
                                      <p className="text-xs font-medium text-amber-500">Voice Risk Raised</p>
                                      <p className="text-[11px] text-muted-foreground">Audio characteristics flagged as uncertain.</p>
                                    </div>
                                    <div className="relative">
                                      <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-amber-500" />
                                      <p className="text-xs font-medium text-amber-500">Registry Check Failed</p>
                                      <p className="text-[11px] text-muted-foreground">Caller ID origin could not be independently authenticated.</p>
                                    </div>
                                  </div>
                                  <p className="text-[11px] text-muted-foreground pt-2 italic">Recommendation: Perform step-up verification.</p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        <div className="mt-auto space-y-4">
                          <Button onClick={nextStage} className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-black rounded-xl text-base font-medium shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                            Verify Caller
                          </Button>
                          <Button variant="ghost" onClick={replayConversation} className="w-full h-12 text-muted-foreground hover:text-foreground">
                            <RefreshCw className="w-4 h-4 mr-2" /> Replay Conversation
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </motion.div>
            )}

            {/* STAGE 3: VERIFICATION */}
            {currentStage === "VERIFICATION" && (
              <motion.div key="verification" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md mx-auto space-y-8">
                <div className="text-center space-y-2 mb-8">
                  <h2 className="text-3xl font-semibold tracking-tight">Security Challenge</h2>
                  <p className="text-muted-foreground font-light text-sm">Vaani Kavach requested a step-up liveness check.</p>
                </div>

                <div className="p-6 border border-white/5 bg-[#0A0A0C] rounded-2xl space-y-8 shadow-2xl relative overflow-hidden">
                  
                  {/* Sequence 1: Request Button */}
                  {verificationStep === 0 && (
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
                      <Fingerprint className="w-12 h-12 text-muted-foreground/30" />
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Trigger a Voice CAPTCHA to verify if a live human is speaking.
                      </p>
                      <Button onClick={startVerificationSequence} className="h-12 px-8 rounded-xl bg-white text-black hover:bg-gray-200">
                        Request Voice Challenge
                      </Button>
                    </div>
                  )}

                  {/* Sequence 2: Digits generated */}
                  {verificationStep >= 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                          <Fingerprint className="w-5 h-5 text-foreground/70" />
                        </div>
                        <span className="font-medium text-sm">Challenge Dispatched</span>
                      </div>
                      
                      <div className="text-center space-y-2">
                        <p className="text-xs text-muted-foreground uppercase tracking-widest">Please read aloud:</p>
                        <div className="text-4xl font-mono tracking-[0.4em] text-foreground/90">7294</div>
                      </div>
                    </motion.div>
                  )}

                  {/* Sequence 3: Caller Response */}
                  {verificationStep >= 2 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4 border-t border-white/5">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Simulated Caller Response</p>
                      <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 w-full">
                        <Activity className="w-4 h-4 text-amber-500" />
                        <span className="text-sm text-amber-500 font-light italic">"Seven... two... uh..."</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Sequence 4: Outcome */}
                  {verificationStep >= 3 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4 space-y-4">
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                        <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-red-500">Liveness Failed</p>
                          <p className="text-xs text-red-400/80 leading-relaxed">
                            The response did not satisfy the demo verification checks. 
                          </p>
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground/60 text-center">Note: CAPTCHA alone cannot definitively prove identity, but it signals high risk.</p>
                    </motion.div>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <Button 
                    onClick={nextStage} 
                    disabled={verificationStep < 3} 
                    className="w-full h-12"
                  >
                    Attempt Transfer <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STAGE 4: PAYMENT */}
            {currentStage === "PAYMENT" && (
              <motion.div key="payment" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="w-full max-w-sm mx-auto space-y-6">
                <div className="text-center space-y-2 mb-2">
                  <Badge variant="outline" className="border-white/10 text-muted-foreground bg-white/5 uppercase tracking-widest text-[10px]">Mobile Banking</Badge>
                </div>

                <div className="bg-[#0A0A0C] border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col min-h-[600px] relative">
                  
                  {paymentStep === 0 ? (
                    <>
                      <div className="h-16 border-b border-white/5 flex items-center justify-center px-4 bg-white/[0.01]">
                        <span className="font-semibold text-foreground/90 tracking-tight text-sm">Secure Banking Transfer</span>
                      </div>

                      <div className="flex-1 p-6 flex flex-col">
                        <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 mb-2">
                            <Lock className="w-6 h-6 text-muted-foreground/50" />
                          </div>
                          
                          <div className="text-center space-y-2 w-full">
                            <p className="text-xs text-muted-foreground uppercase tracking-widest">Amount to Transfer</p>
                            <p className="text-5xl font-light tracking-tight text-foreground">₹25,000</p>
                          </div>

                          <div className="w-full p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-4">
                            <div className="flex justify-between items-center border-b border-white/5 pb-3">
                              <span className="text-xs text-muted-foreground">To</span>
                              <span className="text-sm font-medium">Demo Recipient A</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">From</span>
                              <span className="text-sm font-medium">Checking Account</span>
                            </div>
                          </div>
                        </div>

                        <Button onClick={startPaymentSequence} className="w-full h-14 rounded-xl text-base font-medium mt-4 shadow-[0_0_15px_rgba(255,255,255,0.05)] bg-white text-black hover:bg-gray-200">
                          Confirm Transfer
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8 text-center bg-[#050505]">
                      <h3 className="text-xl font-medium mb-4">Processing Transfer</h3>
                      
                      <div className="w-full space-y-6 text-left">
                        {paymentStep >= 1 && (
                          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4">
                            <Activity className="w-5 h-5 text-amber-500 shrink-0" />
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Call Risk Check</p>
                              <p className="text-xs text-muted-foreground">Suspicious call assessment available.</p>
                            </div>
                          </motion.div>
                        )}
                        
                        {paymentStep >= 2 && (
                          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4">
                            <FileKey className="w-5 h-5 text-blue-500 shrink-0" />
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Risk Receipt</p>
                              <p className="text-xs text-muted-foreground">Call assessment associated with this ₹25,000 transaction.</p>
                            </div>
                          </motion.div>
                        )}

                        {paymentStep >= 3 && (
                          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4">
                            <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Action Protection API</p>
                              <p className="text-xs text-muted-foreground">The simulated banking app checks the receipt and applies its configured security policy.</p>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              </motion.div>
            )}

            {/* STAGE 5: PROTECTION */}
            {currentStage === "PROTECTION" && (
              <motion.div key="protection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-3xl mx-auto space-y-12 py-8">
                <div className="text-center space-y-6">
                  <Badge variant="outline" className="border-white/10 text-muted-foreground bg-white/5 uppercase tracking-widest text-[10px] mb-4">Illustrative Simulation</Badge>
                  
                  <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto border border-red-500/20">
                    <Lock className="w-6 h-6 text-red-500" />
                  </div>
                  <h2 className="text-4xl font-semibold tracking-tight text-foreground">Transfer Held</h2>
                  <p className="text-muted-foreground text-sm md:text-base font-light leading-relaxed max-w-xl mx-auto">
                    Transfer held for independent verification.
                  </p>
                </div>

                <div className="p-8 border border-white/5 rounded-2xl bg-[#0A0A0C] flex flex-col md:flex-row items-center justify-between gap-8 max-w-2xl mx-auto">
                  <div className="flex-1 space-y-2 text-center md:text-left">
                    <p className="text-sm font-medium text-foreground">Protection Chain Successful</p>
                    <p className="text-xs text-muted-foreground font-light flex items-center justify-center md:justify-start gap-2">
                      CALL <ArrowRight className="w-3 h-3" /> RISK RECEIPT <ArrowRight className="w-3 h-3" /> BANKING ACTION
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-red-500/30 text-red-400 bg-red-500/5 px-3 py-1">API: BLOCK</Badge>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-12 border-t border-white/5">
                  <Link href="/architecture">
                    <Button variant="outline" className="w-full sm:w-auto border-white/10 hover:bg-white/[0.02] h-12">
                      Understand How It Works
                    </Button>
                  </Link>
                  <Link href="/try-model">
                    <Button className="w-full sm:w-auto h-12">
                      Test the Technology
                    </Button>
                  </Link>
                </div>
                
                <div className="text-center pt-6">
                  <button onClick={restart} className="text-xs text-muted-foreground/50 hover:text-foreground transition-colors uppercase tracking-widest font-medium">
                    Restart Experience
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
