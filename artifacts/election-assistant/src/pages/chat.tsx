import { useState, useRef, useEffect, useMemo } from "react";
import { 
  useListGeminiConversations, 
  useCreateGeminiConversation, 
  useGetGeminiConversation, 
  useListGeminiMessages,
  useDeleteGeminiConversation
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Send, Plus, Trash2, Bot, User, Menu, X, ArrowLeft, HardDrive, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { apiUrl } from "@/lib/api-url";
import { normalizeConversations, normalizeMessages } from "@/lib/safe-data";

const SUGGESTED_QUESTIONS = [
  "How do I register to vote?",
  "What documents do I need on voting day?",
  "How does the EVM work?",
  "What is NOTA?",
  "How are votes counted?",
  "What is Model Code of Conduct?"
];

export default function Chat() {
  const { toast } = useToast();
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: conversations, refetch: refetchConversations } = useListGeminiConversations();
  const { data: messages, refetch: refetchMessages, isLoading: messagesLoading } = useListGeminiMessages(activeConversationId || 0, {
    query: { enabled: !!activeConversationId, queryKey: ['messages', activeConversationId] }
  });

  const createConversation = useCreateGeminiConversation();
  const deleteConversation = useDeleteGeminiConversation();
  const safeConversations = useMemo(() => normalizeConversations(conversations), [conversations]);
  const safeMessages = useMemo(() => normalizeMessages(messages), [messages]);

  useEffect(() => {
    if (safeConversations.length > 0 && !activeConversationId) {
      setActiveConversationId(safeConversations[0].id);
    }
  }, [safeConversations, activeConversationId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingText]);

  const handleNewChat = async () => {
    try {
      const newConv = await createConversation.mutateAsync({ data: { title: "New Conversation" } });
      setActiveConversationId(newConv.id);
      refetchConversations();
      if (window.innerWidth < 768) setSidebarOpen(false);
    } catch (e) {
      toast({ title: "Failed to create conversation", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteConversation.mutateAsync({ id });
      refetchConversations();
      if (activeConversationId === id) {
        setActiveConversationId(null);
      }
    } catch (e) {
      toast({ title: "Failed to delete conversation", variant: "destructive" });
    }
  };

  const sendMessage = async (conversationId: number, content: string) => {
    try {
      setIsStreaming(true);
      setStreamingText("");
      
      const response = await fetch(apiUrl(`/api/gemini/conversations/${conversationId}/messages`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      
      if (!response.ok) throw new Error("Failed to send");
      
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const text = decoder.decode(value);
        const lines = text.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const json = JSON.parse(line.slice(6));
              if (json.done) break;
              if (json.content) setStreamingText(prev => prev + json.content);
            } catch (e) {}
          }
        }
      }
    } catch (error) {
      toast({ title: "Error sending message", variant: "destructive" });
    } finally {
      setIsStreaming(false);
      setStreamingText("");
      refetchMessages();
    }
  };

  const handleSubmit = async (e?: React.FormEvent, presetQuestion?: string) => {
    e?.preventDefault();
    const textToSend = presetQuestion || input;
    if (!textToSend.trim() || isStreaming) return;

    setInput("");
    
    let currentId = activeConversationId;
    if (!currentId) {
      try {
        const newConv = await createConversation.mutateAsync({ data: { title: textToSend.slice(0, 30) } });
        currentId = newConv.id;
        setActiveConversationId(currentId);
        refetchConversations();
      } catch (e) {
        toast({ title: "Error", variant: "destructive" });
        return;
      }
    }

    // Optimistically update messages locally or rely on refetch
    // For simplicity, we just send and refetch
    await sendMessage(currentId, textToSend);
  };

  const hasMessages = safeMessages.length > 0;
  const showSuggestions = !hasMessages && !isStreaming && !streamingText;

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background">
      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-72 bg-card border-r border-border z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="icon" className="md:hidden">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h2 className="font-semibold flex-1 ml-2 md:ml-0">Conversations</h2>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-4">
          <Button onClick={handleNewChat} className="w-full justify-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            New Chat
          </Button>
        </div>
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1 pb-4">
            {safeConversations.map((conv) => (
              <div 
                key={conv.id}
                onClick={() => { setActiveConversationId(conv.id); if (window.innerWidth < 768) setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors text-sm ${activeConversationId === conv.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'}`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span className="truncate">{conv.title || "New Conversation"}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:text-destructive"
                  onClick={(e) => handleDelete(conv.id, e)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Chat Header */}
        <header className="h-14 border-b bg-background/80 backdrop-blur-md flex items-center px-4 shrink-0">
          <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-semibold text-sm">ElectionGuide AI</h1>
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/20 text-muted-foreground bg-primary/5">
                  <HardDrive className="w-3 h-3 mr-1" />
                  Google Drive Docs
                </Badge>
              </div>
            </div>
          </div>
          <div className="ml-auto hidden md:block">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
          {messagesLoading && activeConversationId ? (
            <div className="flex justify-start">
              <div className="bg-muted p-4 rounded-2xl rounded-tl-sm w-full max-w-md space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ) : null}

          {safeMessages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] md:max-w-2xl ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                    : 'bg-card border shadow-sm text-card-foreground rounded-tl-sm'
                }`}>
                  <div className="whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">
                    {msg.content}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {isStreaming && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex gap-3 max-w-[85%] md:max-w-2xl">
                <div className="w-8 h-8 shrink-0 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-2xl text-sm leading-relaxed bg-card border shadow-sm text-card-foreground rounded-tl-sm min-w-[200px]">
                  {streamingText ? (
                    <div className="whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">
                      {streamingText}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-xs">ElectionGuide is thinking...</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {showSuggestions && (
            <div className="flex flex-col items-center justify-center h-full pt-10 px-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2 text-center">How can I help you understand the elections?</h3>
              <p className="text-sm text-muted-foreground mb-8 text-center max-w-md">
                I can answer questions about voting, the election process, and official guidelines.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <Button 
                    key={i} 
                    variant="outline" 
                    className="justify-start h-auto py-3 px-4 text-left font-normal bg-card hover:bg-primary hover:text-primary-foreground transition-all duration-200 whitespace-normal"
                    onClick={() => handleSubmit(undefined, q)}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </div>
          )}
          <div className="h-4 w-full shrink-0" />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-background border-t shrink-0">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative flex items-center">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about the election..."
              className="pr-12 py-6 rounded-2xl bg-card border-border/50 shadow-sm text-base focus-visible:ring-primary/20"
              disabled={isStreaming}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!input.trim() || isStreaming}
              className={`absolute right-2 rounded-xl transition-all duration-200 ${input.trim() ? 'bg-accent text-accent-foreground hover:bg-accent/90' : 'bg-muted text-muted-foreground'}`}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <div className="text-center mt-2">
            <span className="text-[10px] text-muted-foreground">AI can make mistakes. Verify important information on the ECI website.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
