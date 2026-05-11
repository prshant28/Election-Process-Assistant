import { useGetElectionTimeline } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { normalizeTimeline } from "@/lib/safe-data";

export default function Timeline() {
  const { data: timeline, isLoading } = useGetElectionTimeline();
  const safeTimeline = useMemo(() => normalizeTimeline(timeline), [timeline]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Election Timeline</h1>
        <p className="text-xl text-muted-foreground">Understanding the phases of the world's largest democratic exercise</p>
      </div>

      <div className="relative border-l-2 border-primary/20 ml-4 md:ml-12 pl-8 space-y-12">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[41px] bg-background border-2 border-muted w-5 h-5 rounded-full" />
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            </div>
          ))
        ) : safeTimeline.length > 0 ? (
          safeTimeline.map((phase, i) => (
            <motion.div 
              key={phase.phase}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative"
            >
              <div className="absolute -left-[41px] bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center shadow-md ring-4 ring-background">
                <span className="text-xs font-bold">{phase.phase}</span>
              </div>
              <Card className="hover:shadow-md transition-shadow border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                    <CardTitle className="text-2xl text-primary">{phase.title}</CardTitle>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {phase.durationDays} Days
                    </Badge>
                  </div>
                  <CardDescription className="text-base text-foreground/80">{phase.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Key Activities</h4>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {phase.keyActivities.map((activity, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{activity}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-10 text-muted-foreground">Timeline data is currently unavailable.</div>
        )}
      </div>
    </div>
  );
}
