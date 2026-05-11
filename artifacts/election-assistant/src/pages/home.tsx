import { useGetElectionQuickStats, useListElectionTopics } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { ArrowRight, UserCheck, Calendar, Vote, Monitor, BarChart2, BookOpen, MessageSquare, HelpCircle, Sparkles, ShieldCheck, Search } from "lucide-react";
import { motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import { normalizeTopics } from "@/lib/safe-data";

const iconMap: Record<string, React.ElementType> = {
  UserCheck,
  Calendar,
  Vote,
  Monitor,
  BarChart2,
  BookOpen,
};

const featureCards = [
  {
    title: "Trusted Learning Paths",
    description: "Get structured election knowledge from registration to results in one flow.",
    icon: ShieldCheck,
  },
  {
    title: "AI Civic Assistant",
    description: "Ask follow-up questions anytime with context-aware election guidance.",
    icon: Sparkles,
  },
  {
    title: "Quick Topic Discovery",
    description: "Find the exact process you need with fast topic search and direct guides.",
    icon: Search,
  },
];

export default function Home() {
  const { data: topics, isLoading: topicsLoading } = useListElectionTopics();
  const { data: stats, isLoading: statsLoading } = useGetElectionQuickStats();
  const [query, setQuery] = useState("");
  const safeTopics = useMemo(() => normalizeTopics(topics), [topics]);
  const filteredTopics = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return safeTopics;
    return safeTopics.filter((topic) =>
      [topic.title, topic.titleHindi, topic.description, ...topic.tags]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, safeTopics]);

  return (
    <div className="flex flex-col w-full pb-20 md:pb-0">
      <section className="relative overflow-hidden bg-primary text-primary-foreground pt-20 pb-24 px-4">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="container mx-auto relative z-10 flex flex-col items-center text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-3xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              समझिए भारत का चुनाव प्रक्रिया <br />
              <span className="text-primary-foreground/80 text-3xl md:text-5xl mt-2 block">Understand India&apos;s Election Process</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto">
              Your comprehensive guide to the world&apos;s largest democracy. Learn how to vote, understand the phases, and get answers to your civic questions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/chat">
                <Button size="lg" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 px-8 text-lg w-full sm:w-auto shadow-xl shadow-accent/20">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Ask AI Assistant
                </Button>
              </Link>
              <Link href="/topics">
                <Button size="lg" variant="outline" className="rounded-full border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 px-8 text-lg w-full sm:w-auto bg-transparent">
                  Explore Topics
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 divide-x divide-border">
            {statsLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center justify-center text-center p-4">
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))
            ) : stats ? (
              <>
                <StatItem value={formatStatValue(stats.totalVoters)} label="Total Voters" />
                <StatItem value={formatStatValue(stats.pollingStations)} label="Polling Stations" />
                <StatItem value={formatStatValue(stats.electionStaff)} label="Election Staff" />
                <StatItem value={formatStatValue(stats.constituencies)} label="Constituencies" />
                <StatItem value={formatStatValue(stats.states)} label="States/UTs" />
                <StatItem value={formatStatValue(stats.languages)} label="Languages" />
              </>
            ) : null}
          </div>
        </div>
      </section>

      <section className="py-16 container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-4">
          {featureCards.map((feature) => (
            <Card key={feature.title} className="border-border/50">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-20 container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Election Guides</h2>
            <p className="text-muted-foreground max-w-2xl">Step-by-step information on every aspect of the election.</p>
          </div>
          <Link href="/topics" className="hidden md:flex items-center text-primary font-medium hover:text-accent transition-colors">
            View all <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>

        <div className="mb-6">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search guides (e.g. EVM, voter registration, NOTA)"
            className="max-w-xl"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topicsLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="border border-border/50 shadow-sm">
                <CardHeader className="pb-4">
                  <Skeleton className="w-10 h-10 rounded-lg mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))
          ) : filteredTopics.length > 0 ? (
            filteredTopics.slice(0, 6).map((topic, i) => {
              const Icon = iconMap[topic.icon] || HelpCircle;
              return (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Link href={`/guide/${topic.id}`}>
                    <Card className="h-full cursor-pointer transition-all hover:shadow-md hover:border-primary/20 group hover:-translate-y-1">
                      <CardHeader className="pb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <Icon className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">{topic.title}</CardTitle>
                        <CardDescription className="text-sm font-medium text-muted-foreground/80">{topic.titleHindi}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm line-clamp-3">{topic.description}</p>
                        <div className="mt-6 flex items-center text-sm font-medium text-primary group-hover:text-accent transition-colors">
                          Read guide <ArrowRight className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              No matching guide found. Try a different search keyword.
            </div>
          )}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold mb-2">Ready to ask election questions?</h3>
              <p className="text-muted-foreground text-sm">
                Get quick explanations on voter ID, polling day rules, EVMs, counting, and more.
              </p>
            </div>
            <Link href="/chat">
              <Button className="gap-2">
                Open AI Assistant
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      <Link href="/chat">
        <Button className="md:hidden fixed bottom-24 right-4 z-50 rounded-full w-14 h-14 p-0 shadow-xl bg-accent hover:bg-accent/90 text-accent-foreground flex items-center justify-center">
          <MessageSquare className="w-6 h-6" />
        </Button>
      </Link>
    </div>
  );
}

function formatStatValue(value: string | number | null | undefined): string {
  if (typeof value === "number") return value.toString();
  if (typeof value === "string" && value.trim() !== "") return value;
  return "N/A";
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-4">
      <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">{value}</div>
      <div className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
    </div>
  );
}
