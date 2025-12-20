'use client';

import { useState, useMemo, useEffect } from 'react';
import type { QuestionWithValidation } from '@/app/actions';
import { getPerformanceSummary } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { QuizSummary } from './quiz-summary';

type QuizDisplayProps = {
  questions: QuestionWithValidation[];
};

type AnswersState = {
  [questionIndex: number]: number;
};

const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
const difficultyColors: Record<'easy' | 'medium' | 'hard', string> = {
  easy: 'bg-chart-2/10 text-chart-2 border-chart-2/20',
  medium: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  hard: 'bg-chart-1/10 text-chart-1 border-chart-1/20',
};

export function QuizDisplay({ questions }: QuizDisplayProps) {
  const [answers, setAnswers] = useState<AnswersState>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  const sortedQuestions = useMemo(() => {
    return [...questions].sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
  }, [questions]);
  
  const handleAnswerChange = (questionIndex: number, optionIndex: number) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    setIsSummaryLoading(true);
    const results = {
      questions: questions.map((q, index) => ({
        ...q,
        userAnswerIndex: answers[index],
        isCorrect: answers[index] === q.correctAnswerIndex,
      }))
    };
    const summaryResult = await getPerformanceSummary(results);
    if (summaryResult.summary) {
      setSummary(summaryResult.summary);
    } else {
      // You could optionally show an error toast here
      console.error(summaryResult.error);
      setSummary("Sorry, we couldn't generate a summary for your performance at this time.");
    }
    setIsSummaryLoading(false);
  };
  
  const score = useMemo(() => {
    if (!isSubmitted) return 0;
    return sortedQuestions.reduce((acc, question) => {
      const originalIndex = questions.indexOf(question);
      if (answers[originalIndex] === question.correctAnswerIndex) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [isSubmitted, answers, sortedQuestions, questions]);

  return (
    <Card className="animate-in fade-in-50 duration-700 shadow-lg">
      <CardHeader>
        <CardTitle>Generated Quiz</CardTitle>
        <CardDescription>Test your understanding of the extracted concepts. Questions are ranked by difficulty.</CardDescription>
      </CardHeader>
      <CardContent>
        {isSubmitted && (
          <div className="mb-8 rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
            <h3 className="text-xl font-semibold text-primary font-headline">Quiz Complete!</h3>
            <p className="text-4xl font-bold mt-2">Your score: {score} / {sortedQuestions.length}</p>
          </div>
        )}
        
        {isSubmitted && <QuizSummary summary={summary} isLoading={isSummaryLoading} />}

        <div className="space-y-8">
          {sortedQuestions.map((question, index) => {
            const originalIndex = questions.indexOf(question);
            const userAnswer = answers[originalIndex];
            const isCorrect = userAnswer === question.correctAnswerIndex;
            
            return (
              <div key={originalIndex}>
                <div className="flex justify-between items-start mb-4">
                  <p className="font-semibold text-lg flex-1 pr-4">
                    {index + 1}. {question.question}
                  </p>
                  <div className="flex items-center gap-2 ml-auto shrink-0">
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <button aria-label="Difficulty validation status">
                            {question.validation.isValid ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                                <XCircle className="h-5 w-5 text-red-500" />
                            )}
                           </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{question.validation.reason}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Badge className={`capitalize ${difficultyColors[question.difficulty]}`}>
                      {question.difficulty}
                    </Badge>
                  </div>
                </div>

                <RadioGroup
                  value={userAnswer?.toString()}
                  onValueChange={(value) => handleAnswerChange(originalIndex, parseInt(value))}
                  disabled={isSubmitted}
                  className="space-y-2"
                >
                  {question.options.map((option, i) => {
                    let optionStateClasses = "";
                    if (isSubmitted) {
                      if (i === question.correctAnswerIndex) {
                        optionStateClasses = 'bg-chart-2/10 border-chart-2/20 text-chart-2 font-semibold';
                      } else if (i === userAnswer) {
                        optionStateClasses = 'bg-chart-1/10 border-chart-1/20 text-chart-1';
                      }
                    }

                    return (
                      <div key={i} className={`flex items-center space-x-3 p-3 rounded-md border transition-colors ${optionStateClasses}`}>
                        <RadioGroupItem value={i.toString()} id={`q${originalIndex}-o${i}`} />
                        <Label htmlFor={`q${originalIndex}-o${i}`} className={`flex-1 ${isSubmitted ? '' : 'cursor-pointer'}`}>
                          {option}
                        </Label>
                        {isSubmitted && i === question.correctAnswerIndex && <CheckCircle2 className="h-5 w-5 text-chart-2" />}
                        {isSubmitted && i === userAnswer && !isCorrect && <XCircle className="h-5 w-5 text-chart-1" />}
                      </div>
                    );
                  })}
                </RadioGroup>
                {index < sortedQuestions.length - 1 && <Separator className="mt-8" />}
              </div>
            );
          })}
        </div>

        {!isSubmitted && (
          <div className="mt-8 flex justify-end">
            <Button onClick={handleSubmit} disabled={Object.keys(answers).length !== questions.length}>
              Submit Quiz
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
