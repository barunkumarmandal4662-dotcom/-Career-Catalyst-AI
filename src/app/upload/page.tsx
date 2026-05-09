
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle, ArrowRight, Loader2, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { aiSkillGapAnalysis } from "@/ai/flows/ai-skill-gap-analysis";

const ROLES = [
  'Backend Engineer',
  'Frontend Developer',
  'Full Stack Developer',
  'AI Engineer',
  'Data Analyst',
  'DevOps Engineer',
  'Cloud Engineer',
];

export default function UploadPage() {
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const router = useRouter();

  const handleAnalyze = async () => {
    if (!resumeText || !targetRole) {
      toast({
        title: "Missing Information",
        description: "Please provide your resume text and select a target role.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setUploadProgress(20);

    try {
      // Simulate progress for UI feel
      const timer = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 300);

      // Perform the AI Skill Gap Analysis
      const result = await aiSkillGapAnalysis({
        resumeText,
        targetRole: targetRole as any
      });

      clearInterval(timer);
      setUploadProgress(100);

      // Store in session storage for the results page (simulating a database/state store)
      sessionStorage.setItem("lastAnalysis", JSON.stringify({
        resumeText,
        targetRole,
        analysis: result
      }));

      toast({
        title: "Analysis Complete",
        description: "We've identified your career gaps and strengths.",
      });

      setTimeout(() => {
        router.push("/analysis");
      }, 500);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze resume. Please try again.",
        variant: "destructive"
      });
      setIsAnalyzing(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-12 px-6">
      <div className="mb-10 text-center">
        <h1 className="font-headline text-4xl font-bold mb-3">Begin Your Transformation</h1>
        <p className="text-muted-foreground text-lg">Select your target career role and paste your current resume content.</p>
      </div>

      <div className="grid gap-8">
        <Card className="glass-morphism border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-accent" />
              1. Resume Content
            </CardTitle>
            <CardDescription>
              Paste the text from your PDF or DOCX resume below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Textarea 
                  placeholder="Paste your resume text here..." 
                  className="min-h-[300px] bg-background/50 border-white/5 focus-visible:ring-accent"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="w-4 h-4" />
                <span>Supports plain text extraction</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-accent" />
              2. Target Role
            </CardTitle>
            <CardDescription>
              Which role are you aiming for next?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid w-full items-center gap-1.5">
                <Select onValueChange={setTargetRole} value={targetRole}>
                  <SelectTrigger className="h-12 bg-background/50 border-white/5">
                    <SelectValue placeholder="Choose a career path" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isAnalyzing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>AI Engine Working...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2 bg-secondary" />
                </div>
              )}

              <Button 
                className="w-full h-12 bg-primary hover:bg-primary/90 text-lg group" 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze Career Path
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
