import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { MessageSquare, LayoutGrid, Calendar, Home, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  const isChat = location === "/chat";

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground font-sans">
      {!isChat && (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold">
                  E
                </div>
                <span className="font-bold text-lg tracking-tight">ElectionGuide</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/">
                <span className={`text-sm font-medium transition-colors hover:text-accent cursor-pointer ${location === "/" ? "text-accent" : "text-muted-foreground"}`}>Home</span>
              </Link>
              <Link href="/topics">
                <span className={`text-sm font-medium transition-colors hover:text-accent cursor-pointer ${location === "/topics" ? "text-accent" : "text-muted-foreground"}`}>Topics</span>
              </Link>
              <Link href="/timeline">
                <span className={`text-sm font-medium transition-colors hover:text-accent cursor-pointer ${location === "/timeline" ? "text-accent" : "text-muted-foreground"}`}>Timeline</span>
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/chat">
                <Button className="rounded-full gap-2 font-medium bg-primary text-primary-foreground hover:bg-primary/90">
                  <MessageSquare className="w-4 h-4" />
                  Ask AI
                </Button>
              </Link>
            </div>
          </div>
        </header>
      )}

      <main className={`flex-1 flex flex-col ${isChat ? "" : ""}`}>
        {children}
      </main>

      {!isChat && (
        <footer className="border-t py-8 bg-card text-card-foreground">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-xs">
                E
              </div>
              <span className="font-medium text-sm">ElectionGuide AI</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              An AI-powered civic education tool. For official information, visit the Election Commission of India website.
            </p>
          </div>
        </footer>
      )}

      {!isChat && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background flex items-center justify-around p-2 pb-safe z-50">
          <Link href="/">
            <div className={`flex flex-col items-center p-2 rounded-lg ${location === "/" ? "text-accent" : "text-muted-foreground"}`}>
              <Home className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">Home</span>
            </div>
          </Link>
          <Link href="/topics">
            <div className={`flex flex-col items-center p-2 rounded-lg ${location === "/topics" ? "text-accent" : "text-muted-foreground"}`}>
              <LayoutGrid className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">Topics</span>
            </div>
          </Link>
          <Link href="/timeline">
            <div className={`flex flex-col items-center p-2 rounded-lg ${location === "/timeline" ? "text-accent" : "text-muted-foreground"}`}>
              <Calendar className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">Timeline</span>
            </div>
          </Link>
          <Link href="/chat">
            <div className={`flex flex-col items-center p-2 rounded-lg ${location === "/chat" ? "text-accent" : "text-muted-foreground"}`}>
              <MessageSquare className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">Ask AI</span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
