
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ChevronLeft, 
  MessageCircle, 
  Code2, 
  ShieldAlert, 
  UserCheck, 
  RefreshCcw,
  Sparkles
} from "lucide-react";
import { generateInterviewQuestions, AiInterviewQuestionGenerationOutput } from "@/ai/flows/ai-interview-question-generation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function InterviewPage() {
  const [questions, setQuestions] = useState<AiInterviewQuestionGenerationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [targetRole, setTargetRole] = useState("");
  const router = useRouter();

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const lastAnalysis = sessionStorage.getItem("lastAnalysis");
      if (!lastAnalysis) {
        router.push("/upload");
        return;
      }
      const parsedData = JSON.parse(lastAnalysis);
      setTargetRole(parsedData.targetRole);

      const result = await generateInterviewQuestions({
        targetRole: parsedData.targetRole,
        difficulty: "Intermediate"
      });
      setQuestions(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [router]);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <Sparkles className="w-12 h-12 text-accent animate-bounce" />
        <p className="text-xl font-headline">Simulating High-Stakes Interviews...</p>
      </div>
    );
  }

  const categories = [
    { id: 'hr', title: 'Behavioral & HR', icon: <UserCheck className="w-5 h-5 text-blue-400" />, items: questions?.hrQuestions },
    { id: 'technical', title: 'Technical Theory', icon: <ShieldAlert className="w-5 h-5 text-yellow-400" />, items: questions?.technicalQuestions },
    { id: 'coding', title: 'Coding Challenges', icon: <Code2 className="w-5 h-5 text-green-400" />, items: questions?.codingQuestions },
    { id: 'scenario', title: 'Problem Solving Scenarios', icon: <MessageCircle className="w-5 h-5 text-purple-400" />, items: questions?.scenarioQuestions },
  ];

  return (
    <div className="container mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-12">
        <div>
          <Button 
            variant="ghost" 
            className="mb-4 hover:bg-white/5" 
            onClick={() => router.back()}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h1 className="font-headline text-4xl font-bold">Interview Prep: <span className="text-accent">{targetRole}</span></h1>
        </div>
        <Button variant="outline" className="glass-morphism" onClick={fetchQuestions}>
          <RefreshCcw className="mr-2 h-4 w-4" /> Refresh Questions
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((cat) => (
          <Card key={cat.id} className="glass-morphism border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {cat.icon}
                {cat.title}
              </CardTitle>
              <CardDescription>Industry-standard questions for the {targetRole} role.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {cat.items?.map((q, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border-white/5">
                    <AccordionTrigger className="text-left text-sm hover:no-underline hover:text-accent transition-colors">
                      {q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground bg-black/20 p-4 rounded-lg mt-2 italic">
                      Tip: Focus on the STAR method (Situation, Task, Action, Result) when answering this question. Highlight specific technologies like {targetRole.split(' ')[0]} where applicable.
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
