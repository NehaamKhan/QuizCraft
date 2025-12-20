import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from 'lucide-react';

type QuizSummaryProps = {
  summary: string | null;
  isLoading: boolean;
};

// A simple markdown-to-html renderer
function SimpleMarkdown({ content }: { content: string }) {
  const htmlContent = content
    .split('\n')
    .map(line => {
      if (line.startsWith('* ')) {
        return `<li>${line.substring(2)}</li>`;
      }
      if (line.startsWith('- ')) {
        return `<li>${line.substring(2)}</li>`;
      }
      if (line.trim() === '---') {
        return '<hr class="my-2 border-border" />';
      }
      return line;
    })
    .join('<br />')
    // A bit of a hack to wrap list items in a ul
    .replace(/<li>/g, '<ul><li>')
    .replace(/<\/li>(?!<li>)/g, '</li></ul>')
    .replace(/<\/li><ul>/g, '</li><li>')
    .replace(/<\/ul><ul>/g, '');


  return <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}


export function QuizSummary({ summary, isLoading }: QuizSummaryProps) {
  return (
    <Card className="mb-8 animate-in fade-in-50 duration-500 bg-card/50 border-dashed border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Sparkles className="h-5 w-5" />
          Performance Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
        {summary && <SimpleMarkdown content={summary} />}
      </CardContent>
    </Card>
  );
}
