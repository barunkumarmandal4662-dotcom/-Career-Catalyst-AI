
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Rocket, 
  Target, 
  Cpu, 
  TrendingUp, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const features = [
    {
      icon: <Target className="w-6 h-6 text-accent" />,
      title: "ATS Optimization",
      description: "Beat the robots with AI-driven keyword injection and formatting fixes."
    },
    {
      icon: <Cpu className="w-6 h-6 text-accent" />,
      title: "Skill Gap Analysis",
      description: "Instantly identify what skills you need for your dream role."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-accent" />,
      title: "Career Roadmap",
      description: "A personalized learning journey from beginner to expert status."
    },
    {
      icon: <Zap className="w-6 h-6 text-accent" />,
      title: "Instant Scoring",
      description: "Get a real-time ATS score and actionable improvement suggestions."
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />

      <nav className="container mx-auto px-6 py-8 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <Rocket className="w-8 h-8 text-accent" />
          <span className="font-headline text-2xl font-bold tracking-tight">Career Catalyst <span className="text-accent">AI</span></span>
        </div>
        <div className="hidden md:flex gap-8 items-center">
          <Link href="#features" className="text-sm font-medium hover:text-accent transition-colors">Features</Link>
          <Link href="/dashboard" className="text-sm font-medium hover:text-accent transition-colors">Dashboard</Link>
          <Button variant="outline" className="border-accent/20 hover:bg-accent/10">Sign In</Button>
          <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-20 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-6 px-4 py-1 border-accent/20 bg-accent/5 text-accent animate-pulse">
              Powered by GenAI 2.5 Flash
            </Badge>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-headline text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Your Resume, <span className="text-gradient">Supercharged</span> by AI.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl"
          >
            Transform your standard resume into a high-performance ATS-optimized career asset. Analyze skill gaps, generate roadmaps, and land your dream role.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 h-14" asChild>
              <Link href="/upload">
                Optimize Now <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 h-14 glass-morphism border-white/10 hover:bg-white/5">
              View Demo Dashboard
            </Button>
          </motion.div>
        </div>

        <section id="features" className="py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full glass-morphism border-none hover:translate-y-[-5px] transition-all duration-300">
                  <CardContent className="pt-8 px-8 pb-8 flex flex-col items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      {feature.icon}
                    </div>
                    <h3 className="font-headline text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="py-20 rounded-3xl bg-primary/5 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <ShieldCheck className="w-64 h-64" />
          </div>
          <div className="container px-8 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h2 className="font-headline text-4xl font-bold">Why choose Career Catalyst?</h2>
              <ul className="space-y-4">
                {[
                  "Advanced NLP techniques for precise skill extraction",
                  "Deep-learning models to predict ATS filtering behaviors",
                  "Actionable learning roadmaps tailored to your industry",
                  "Realistic interview questions based on current market trends"
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-accent shrink-0 mt-0.5" />
                    <span className="text-lg text-muted-foreground">{text}</span>
                  </li>
                ))}
              </ul>
              <Button size="lg" className="bg-primary hover:bg-primary/90 mt-4">Learn More</Button>
            </div>
            <div className="flex-1 w-full max-w-lg aspect-square relative">
               <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
               <img 
                src="https://picsum.photos/seed/career-1/800/800" 
                alt="AI Career Analysis" 
                className="relative z-10 rounded-2xl border border-white/10 shadow-2xl object-cover w-full h-full"
                data-ai-hint="data analysis"
               />
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-6 py-12 border-t border-white/5 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Career Catalyst AI. Empowering professionals globally.</p>
      </footer>
    </div>
  );
}
