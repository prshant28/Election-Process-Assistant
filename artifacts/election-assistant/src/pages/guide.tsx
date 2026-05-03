import { useParams } from "wouter";
import { useGetElectionTopic } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ExternalLink, ChevronRight } from "lucide-react";

export default function Guide() {
  const params = useParams<{ topicId: string }>();
  const id = params.topicId;
  
  const { data: topic, isLoading } = useGetElectionTopic(id || "", {
    query: { enabled: !!id, queryKey: ['topic', id] }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl space-y-8">
        <Skeleton className="h-10 w-24 mb-8" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <div className="space-y-4 mt-8">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Topic not found</h2>
        <Link href="/topics">
          <Button variant="outline">Back to Topics</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link href="/topics">
        <Button variant="ghost" className="mb-8 pl-0 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Topics
        </Button>
      </Link>

      <div className="mb-10">
        <div className="flex gap-2 mb-4">
          {topic.tags.map(tag => (
            <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-foreground">{topic.title}</h1>
        <h2 className="text-xl md:text-2xl text-muted-foreground font-medium mb-6">{topic.titleHindi}</h2>
        <p className="text-lg leading-relaxed text-foreground/80">{topic.description}</p>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
        {topic.content.split('\n').map((paragraph, i) => (
          paragraph ? <p key={i}>{paragraph}</p> : null
        ))}
      </div>

      {topic.steps && topic.steps.length > 0 && (
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-6">Step-by-Step Guide</h3>
          <div className="space-y-4">
            {topic.steps.map((step, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-xl bg-card border shadow-sm">
                <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold shrink-0">
                  {i + 1}
                </div>
                <div className="pt-1 text-foreground/90">{step}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {topic.officialLinks && topic.officialLinks.length > 0 && (
        <div className="bg-muted/50 rounded-2xl p-6 md:p-8 border border-border">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-primary" />
            Official Resources
          </h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Visit the Election Commission of India (ECI) portals for official information and services.
          </p>
          <div className="grid gap-3">
            {topic.officialLinks.map((link, i) => (
              <a 
                key={i} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-xl bg-background border hover:border-primary/50 hover:shadow-sm transition-all group"
              >
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">{link.label}</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
