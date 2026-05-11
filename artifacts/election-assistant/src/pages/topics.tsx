import { useListElectionTopics } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserCheck, Calendar, Vote, Monitor, BarChart2, BookOpen, HelpCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import React, { useMemo } from "react";
import { normalizeTopics } from "@/lib/safe-data";

const iconMap: Record<string, React.ElementType> = {
  UserCheck,
  Calendar,
  Vote,
  Monitor,
  BarChart2,
  BookOpen,
};

export default function Topics() {
  const { data: topics, isLoading } = useListElectionTopics();
  const safeTopics = useMemo(() => normalizeTopics(topics), [topics]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Election Topics</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Explore comprehensive guides on all aspects of the Indian election process.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border border-border/50 shadow-sm">
              <CardHeader className="pb-4">
                <Skeleton className="w-12 h-12 rounded-xl mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))
        ) : safeTopics.length > 0 ? (
          safeTopics.map((topic, i) => {
            const Icon = iconMap[topic.icon] || HelpCircle;
            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link href={`/guide/${topic.id}`}>
                  <Card className="h-full cursor-pointer transition-all hover:shadow-lg hover:border-primary/30 group hover:-translate-y-1 bg-card">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-14 h-14 rounded-xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-sm">
                          <Icon className="w-7 h-7" />
                        </div>
                      </div>
                      <CardTitle className="text-2xl group-hover:text-primary transition-colors">{topic.title}</CardTitle>
                      <CardDescription className="text-base font-medium text-muted-foreground/80">{topic.titleHindi}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm line-clamp-4">{topic.description}</p>
                      
                      <div className="mt-6 flex flex-wrap gap-2">
                        {topic.tags.map(tag => (
                          <span key={tag} className="px-2.5 py-1 rounded-md bg-muted text-muted-foreground text-xs font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="mt-6 flex items-center text-sm font-medium text-primary group-hover:text-accent transition-colors pt-4 border-t border-border/50">
                        Read full guide <ArrowRight className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-20 text-muted-foreground">
            No topics available at the moment.
          </div>
        )}
      </div>
    </div>
  );
}
