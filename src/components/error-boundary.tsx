import { ErrorDisplay } from "@/pages/errors/error-display";
import { ISSUE_URL } from "@/utils/constants";
import type { ErrorInfo } from "react";
import { Component } from "react";
import { Button } from "./ui/button";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  message?: string;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return {
      hasError: true,
      message: error.message,
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main style={{ height: "100dvh", width: "100%" }}>
          <ErrorDisplay message="The app drew an Auto-fail." status={500}>
            <div
              style={{
                border: "1px solid var(--palette-1)",
                padding: "0.5rem",
                display: "flex",
                flexFlow: "column nowrap",
                gap: "1rem",
                maxHeight: "50vh",
                overflowY: "auto",
              }}
            >
              <div className="longform">
                <pre
                  style={{ background: "var(--palette-1)", padding: "0.5rem" }}
                >
                  {this.state.message ?? "Unknown error"}
                </pre>
                <p>Check the browser console for further details.</p>
              </div>
              <nav style={{ display: "flex", gap: "0.5rem" }}>
                <Button as="a" href={ISSUE_URL}>
                  Report issue
                </Button>
                <Button as="a" href="/" variant="bare">
                  Go home
                </Button>
              </nav>
            </div>
          </ErrorDisplay>
        </main>
      );
    }

    return this.props.children;
  }
}
