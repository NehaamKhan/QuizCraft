import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb } from "lucide-react";

type ConceptListProps = {
  concepts: string[];
};

export function ConceptList({ concepts }: ConceptListProps) {
  return (
    <Card className="mb-8 animate-in fade-in-50 duration-500 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="text-primary" />
          Extracted Key Concepts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {concepts.map((concept, index) => (
            <Badge key={index} variant="secondary" className="text-base px-3 py-1 font-normal">
              {concept}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
