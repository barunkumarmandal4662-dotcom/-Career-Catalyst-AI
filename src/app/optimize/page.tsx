
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  ChevronLeft, 
  Download, 
  Sparkles, 
  Split, 
  Copy, 
  CheckCircle2,
  Zap,
  Check
} from "lucide-react";
import { aiResumeOptimization, AiResumeOptimizationOutput } from "@/ai/flows/ai-resume-optimization";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function OptimizePage() {
  const [optimized, setOptimized] = useState<AiResumeOptimizationOutput | null>(null);
  const [originalText, setOriginalText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const lastAnalysis = sessionStorage.getItem("lastAnalysis");
    if (!lastAnalysis) {
      router.push("/upload");
      return;
    }

    const parsedData = JSON.parse(lastAnalysis);
    setOriginalText(parsedData.resumeText);
    setTargetRole(parsedData.targetRole);

    const performOptimization = async () => {
      try {
        const result = await aiResumeOptimization({
          resumeContent: parsedData.resumeText,
          targetRole: parsedData.targetRole,
          currentSkills: parsedData.analysis.importantSkills,
          roleRequiredSkills: parsedData.analysis.importantSkills, // Simplified for demo
          roleOptionalSkills: parsedData.analysis.optionalSkills,
          missingSkills: parsedData.analysis.missingSkills
        });
        setOptimized(result);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    performOptimization();
  }, [router]);

  const copyToClipboard = () => {
    if (optimized) {
      navigator.clipboard.writeText(optimized.optimizedResumeContent);
      toast({
        title: "Copied!",
        description: "Optimized resume content copied to clipboard.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <Zap className="w-12 h-12 text-accent animate-pulse" />
        <p className="text-xl font-headline">Injecting High-Impact ATS Keywords...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Button 
            variant="ghost" 
            className="mb-4 hover:bg-white/5" 
            onClick={() => router.back()}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
          <h1 className="font-headline text-4xl font-bold">Optimization Engine</h1>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="glass-morphism" onClick={copyToClipboard}>
            <Copy className="mr-2 h-4 w-4" /> Copy Text
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="glass-morphism border-none">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                AI Improvements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>ATS Keywords Added</span>
                <Badge variant="secondary" className="bg-accent/20 text-accent">{optimized?.atsKeywordsAddedCount || 12}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Bullet Points Rewritten</span>
                <Badge variant="secondary" className="bg-accent/20 text-accent">{optimized?.bulletPointRewritesCount || 8}</Badge>
              </div>
              <Separator className="bg-white/5" />
              <div className="space-y-3">
                <div className="flex gap-3 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  <span>{optimized?.professionalSummaryImprovements || "Summarized your professional experience with impact keywords."}</span>
                </div>
                <div className="flex gap-3 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  <span>{optimized?.projectsSectionImprovements || "Highlighted technical stack and outcomes in projects."}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-xs text-primary font-bold uppercase tracking-widest mb-2">Pro Tip</p>
              <p className="text-sm text-muted-foreground">This version is specifically tuned for {targetRole}. Create another version if you're applying for a different niche.</p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Tabs defaultValue="comparison" className="w-full">
            <TabsList className="bg-secondary/50 border border-white/5 mb-6">
              <TabsTrigger value="comparison" className="flex items-center gap-2">
                <Split className="w-4 h-4" /> Visual Comparison
              </TabsTrigger>
              <TabsTrigger value="full" className="flex items-center gap-2">
                <FileCheck className="w-4 h-4" /> Optimized Version
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="comparison">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest text-center">Before</h3>
                  <div className="p-6 bg-black/40 rounded-xl border border-white/5 h-[600px] overflow-auto text-xs font-mono text-muted-foreground opacity-50 whitespace-pre-wrap">
                    {originalText}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-accent uppercase tracking-widest text-center">After (AI Powered)</h3>
                  <div className="p-6 glass-morphism rounded-xl border-accent/20 h-[600px] overflow-auto text-xs font-mono whitespace-pre-wrap">
                    {optimized?.optimizedResumeContent}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="full">
              <Card className="glass-morphism border-none">
                <CardContent className="p-12">
                  <div className="max-w-3xl mx-auto font-body whitespace-pre-wrap leading-relaxed">
                    {optimized?.optimizedResumeContent}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
