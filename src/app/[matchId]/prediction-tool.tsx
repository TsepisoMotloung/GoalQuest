'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { getMatchInsights, type FormState } from '@/app/actions';
import type { Match } from '@/lib/types';
import { Wand2, BrainCircuit, BotMessageSquare, Percent, BarChart } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
      {pending ? 'Analyzing...' : 'Generate Insights'}
      <Wand2 className="ml-2 h-4 w-4" />
    </Button>
  );
}

const initialState: FormState = {
    success: false,
    message: '',
    data: null,
};

export function PredictionTool({ match }: { match: Match }) {
  const [state, formAction] = useFormState(getMatchInsights, initialState);
  const { toast } = useToast();

   useEffect(() => {
    if (!state.success && state.message) {
      toast({
        variant: "destructive",
        title: "Prediction Error",
        description: state.message,
      });
    }
  }, [state, toast]);


  return (
    <Card>
      <form action={formAction}>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <BrainCircuit className="text-primary" />
            AI Prediction Tool
          </CardTitle>
          <CardDescription>Get AI-powered insights for this match.</CardDescription>
        </CardHeader>
        <CardContent className="hidden">
            {/* Hidden form fields to pass match data */}
            <Input name="team1Name" defaultValue={match.team1.name} />
            <Input name="team2Name" defaultValue={match.team2.name} />
            <Input name="matchDate" defaultValue={new Date(match.date).toISOString().split('T')[0]} />
            <Input name="leagueName" defaultValue={match.league.name} />
            <Textarea name="pastResults" defaultValue="Team1 2-0, Draw 1-1, Team2 3-1" />
            <Textarea name="team1Stats" defaultValue="Last 5: W-W-L-D-W, Top Scorer: M. Rashford (2 goals)" />
            <Textarea name="team2Stats" defaultValue="Last 5: L-W-W-D-L, Top Scorer: R. Sterling (1 goal)" />
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
      
      {state.data && (
        <CardContent className="mt-4 space-y-4">
            <Alert>
                <BotMessageSquare className="h-4 w-4" />
                <AlertTitle className="font-headline">AI Analysis Complete</AlertTitle>
                <AlertDescription>
                    Here are the pre-match insights based on the provided data.
                </AlertDescription>
            </Alert>
            <div className="grid grid-cols-2 gap-4 text-center">
                <Card>
                    <CardHeader className="p-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Prediction</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3">
                        <p className="text-xl font-bold font-headline">{state.data.prediction}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="p-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-1"><Percent className="w-4 h-4"/> Confidence</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3">
                        <p className="text-xl font-bold font-headline">{state.data.confidence}%</p>
                    </CardContent>
                </Card>
            </div>
             <Card>
                <CardHeader className="p-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1"><BarChart className="w-4 h-4"/> Suggested Bet</CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                    <p className="text-sm font-semibold">{state.data.suggestedBet}</p>
                </CardContent>
            </Card>
            <div>
                <h4 className="font-semibold mb-2">Reasoning</h4>
                <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md">{state.data.reasoning}</p>
            </div>
        </CardContent>
      )}

    </Card>
  );
}
