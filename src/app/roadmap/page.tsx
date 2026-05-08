
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ChevronLeft, 
  BookOpen, 
  Code, 
  Database, 
  Terminal, 
  Briefcase,
  Star
} from "lucide-react";
import { generateLearningRoadmap, GenerateLearningRoadmapOutput } from "@/ai/flows/ai-learning-roadmap-generation";

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<GenerateLearningRoadmapOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [targetRole, setTargetRole] = useState("");
  const router = useRouter();

  useEffect(() => {
    const lastAnalysis = sessionStorage.getItem("lastAnalysis");
    if (!lastAnalysis) {
      router.push("/upload");
      return;
    }

    const parsedData = JSON.parse(lastAnalysis);
    setTargetRole(parsedData.targetRole);

    const fetchRoadmap = async () => {
      try {
        const result = await generateLearningRoadmap({
          targetRole: parsedData.targetRole,
          missingSkills: parsedData.analysis.missingSkills,
          currentSkills: parsedData.analysis.importantSkills
        });
        setRoadmap(result);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmap();
  }, [router]);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <Star className="w-12 h-12 text-accent animate-spin" />
        <p className="text-xl font-headline">Crafting Your Career Path...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-6">
      <Button 
        variant="ghost" 
        className="mb-8 hover:bg-white/5" 
        onClick={() => router.back()}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Analysis
      </Button>

      <div className="mb-12">
        <h1 className="font-headline text-4xl font-bold mb-4">Your Expert Roadmap to <span className="text-accent">{targetRole}</span></h1>
        <p className="text-muted-foreground max-w-3xl">This personalized curriculum bridges your existing knowledge with industry requirements for advanced roles.</p>
      </div>

      <div className="space-y-12">
        {roadmap?.roadmap.map((level, i) => (
          <div key={i} className="relative">
            {i !== roadmap.roadmap.length - 1 && (
              <div className="absolute left-[39px] top-20 bottom-[-48px] w-0.5 bg-gradient-to-b from-primary via-accent to-transparent opacity-20" />
            )}
            
            <div className="flex gap-8 items-start">
              <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center shrink-0 border border-white/5 shadow-xl relative z-10">
                {level.level === 'Beginner' && <BookOpen className="w-10 h-10 text-accent" />}
                {level.level === 'Intermediate' && <Code className="w-10 h-10 text-accent" />}
                {level.level === 'Advanced' && <Database className="w-10 h-10 text-accent" />}
                {level.level === 'Expert' && <Terminal className="w-10 h-10 text-accent" />}
              </div>

              <Card className="flex-1 glass-morphism border-none">
                <CardHeader>
                  <div className="flex justify-between items-center mb-2">
                    <Badge className="bg-primary/20 text-accent border-accent/20 hover:bg-primary/30">Level: {level.level}</Badge>
                    <span className="text-xs text-muted-foreground font-mono">STEP 0{i+1}</span>
                  </div>
                  <CardTitle className="text-2xl font-headline">{level.description}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Core Focus Areas</h4>
                    <div className="flex flex-wrap gap-2">
                      {level.skills.map(skill => (
                        <Badge key={skill} variant="secondary" className="bg-white/5 border-white/5">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  {level.resources && level.resources.length > 0 && (
                    <>
                      <Separator className="bg-white/5" />
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Recommended Resources</h4>
                        <ul className="grid md:grid-cols-2 gap-3">
                          {level.resources.map((res, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground bg-black/20 p-3 rounded-lg border border-white/5">
                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                              {res}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center bg-accent/5 p-12 rounded-3xl border border-accent/10">
        <Briefcase className="w-12 h-12 text-accent mx-auto mb-4" />
        <h3 className="text-2xl font-headline font-bold mb-4">Ready to apply these skills?</h3>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Once you complete these steps, update your optimized resume to reflect your new expertise and increase your ATS score further.</p>
        <Button size="lg" className="bg-primary">Explore Jobs for {targetRole}</Button>
      </div>
    </div>
  );
}
