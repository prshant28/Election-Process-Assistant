import type { ReactNode } from "react";
import { Component } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Unhandled UI error:", error);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[100dvh] bg-background flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center border rounded-2xl bg-card p-8 shadow-sm">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
            <p className="text-sm text-muted-foreground mb-6">
              We hit an unexpected error while loading this page. Please refresh and try again.
            </p>
            <Button onClick={this.handleReload} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Reload page
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
