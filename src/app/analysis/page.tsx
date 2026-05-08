
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  AlertTriangle, 
  Lightbulb, 
  ArrowRight, 
  FileCheck, 
  BrainCircuit,
  Map,
  MessageSquareCode
} from "lucide-react";
import { atsScoreFeedbackAndSuggestions } from "@/ai/flows/ats-score-feedback-and-suggestions";
import { motion } from "framer-motion";

export default function AnalysisPage() {
  const [data, setData] = useState<any>(null);
  const [atsResult, setAtsResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const lastAnalysis = sessionStorage.getItem("lastAnalysis");
    if (!lastAnalysis) {
      router.push("/upload");
      return;
    }

    const parsedData = JSON.parse(lastAnalysis);
    setData(parsedData);

    const generateATS = async () => {
      try {
        const score = Math.floor(Math.random() * 30) + 50; // Initial simulated base score
        const feedback = await atsScoreFeedbackAndSuggestions({
          atsScore: score,
          strengths: parsedData.analysis.importantSkills,
          weaknesses: parsedData.analysis.missingSkills,
          suggestions: ["Add more quantitative achievements", "Optimize header for parsing"],
          targetRole: parsedData.targetRole,
          currentResumeSummary: parsedData.resumeText.slice(0, 500)
        });
        setAtsResult({ ...feedback, score });
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    generateATS();
  }, [router]);

  if (isLoading || !data) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <BrainCircuit className="w-12 h-12 text-accent animate-pulse" />
        <p className="text-xl font-headline">Synthesizing ATS Feedback...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="font-headline text-4xl font-bold mb-2">Career Impact Analysis</h1>
          <p className="text-muted-foreground">Targeting: <span className="text-accent font-semibold">{data.targetRole}</span></p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="glass-morphism" onClick={() => router.push("/upload")}>New Analysis</Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={() => router.push("/optimize")}>
            Optimize Resume <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <Card className="lg:col-span-1 glass-morphism border-none">
          <CardHeader>
            <CardTitle className="text-xl">ATS Readiness</CardTitle>
            <CardDescription>Probability of passing automated screeners.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pb-10">
            <div className="relative w-40 h-40 flex items-center justify-center mb-6">
              <svg className="w-full h-full rotate-[-90deg]">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-white/5"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray="440"
                  initial={{ strokeDashoffset: 440 }}
                  animate={{ strokeDashoffset: 440 - (440 * atsResult.score) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="text-accent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-headline font-bold">{atsResult.score}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Score</span>
              </div>
            </div>
            <div className="w-full space-y-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Keyword Density</span>
                <span className="text-accent">High</span>
              </div>
              <Progress value={85} className="h-1.5" />
              <div className="flex justify-between text-sm mb-1">
                <span>Formatting Quality</span>
                <span className="text-accent">Medium</span>
              </div>
              <Progress value={60} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 glass-morphism border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-accent" />
              Expert AI Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed mb-6 text-muted-foreground">
              {atsResult.overallFeedback}
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 font-headline font-bold text-accent">
                  <Trophy className="w-4 h-4" /> Key Strengths
                </h4>
                <ul className="space-y-2">
                  {atsResult.strengthHighlights.map((s: string, i: number) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 font-headline font-bold text-yellow-500">
                  <AlertTriangle className="w-4 h-4" /> Improvement Areas
                </h4>
                <ul className="space-y-2">
                  {atsResult.actionableSuggestions.slice(0, 3).map((s: string, i: number) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="skills" className="space-y-8">
        <TabsList className="bg-secondary/50 p-1 border border-white/5">
          <TabsTrigger value="skills" className="px-8">Skill Gap Analysis</TabsTrigger>
          <TabsTrigger value="roadmap" className="px-8">Learning Roadmap</TabsTrigger>
          <TabsTrigger value="interview" className="px-8">Interview Prep</TabsTrigger>
        </TabsList>

        <TabsContent value="skills">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-red-500/5 border-red-500/10">
              <CardHeader>
                <CardTitle className="text-lg text-red-400">Missing Skills</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {data.analysis.missingSkills.map((s: string) => (
                  <Badge key={s} variant="outline" className="border-red-500/20 text-red-300">{s}</Badge>
                ))}
              </CardContent>
            </Card>
            <Card className="bg-accent/5 border-accent/10">
              <CardHeader>
                <CardTitle className="text-lg text-accent">Important Skills</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {data.analysis.importantSkills.map((s: string) => (
                  <Badge key={s} variant="outline" className="border-accent/20 text-accent">{s}</Badge>
                ))}
              </CardContent>
            </Card>
            <Card className="bg-muted/30 border-white/5">
              <CardHeader>
                <CardTitle className="text-lg text-muted-foreground">Optional/Supportive</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {data.analysis.optionalSkills.map((s: string) => (
                  <Badge key={s} variant="outline" className="border-white/10 text-muted-foreground">{s}</Badge>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="roadmap">
          <Card className="glass-morphism border-none text-center py-20">
            <Map className="w-12 h-12 text-accent mx-auto mb-4 opacity-50" />
            <h3 className="text-2xl font-headline font-bold mb-4">Generate Personalized Learning Roadmap</h3>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">We've identified {data.analysis.missingSkills.length} critical skills you need to master. Get a week-by-week guide to expertise.</p>
            <Button size="lg" className="bg-primary" onClick={() => router.push("/roadmap")}>View Full Roadmap</Button>
          </Card>
        </TabsContent>

        <TabsContent value="interview">
          <Card className="glass-morphism border-none text-center py-20">
            <MessageSquareCode className="w-12 h-12 text-accent mx-auto mb-4 opacity-50" />
            <h3 className="text-2xl font-headline font-bold mb-4">Interview Readiness Simulator</h3>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Get AI-generated coding, scenario, and HR questions specifically for a {data.targetRole} role.</p>
            <Button size="lg" className="bg-primary" onClick={() => router.push("/interview")}>Start Prep</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
