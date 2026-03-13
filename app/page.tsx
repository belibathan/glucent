"use client";

import { useState, useEffect, useCallback } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhotoCapture } from "@/components/photo-capture";
import { MacroDisplay } from "@/components/macro-display";
import { ItemBreakdown } from "@/components/item-breakdown";
import { RefinementChat } from "@/components/refinement-chat";
import { ApiKeyInput } from "@/components/api-key-input";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { buildRefinementMessage } from "@/lib/prompts/refinement-prompt";
import { API_KEY_STORAGE_KEY } from "@/lib/constants";
import type { MealAnalysis, ConversationMessage, ImageBlock, TokenUsage } from "@/lib/types";

interface RefinementMessage {
  role: "user" | "assistant";
  text: string;
}

export default function Home() {
  const [apiKey, setApiKey] = useState<string>("");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<MealAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [refinementHistory, setRefinementHistory] = useState<RefinementMessage[]>([]);
  const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (stored) {
      setApiKey(stored);
    } else {
      setShowKeyModal(true);
    }
  }, []);

  const analyzeImage = useCallback(
    async (messages: ConversationMessage[]) => {
      if (!apiKey) {
        setShowKeyModal(true);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages, apiKey }),
        });

        const data = await res.json();

        if (!res.ok || data.error) {
          setError(data.error || "Analysis failed");
          return;
        }

        if (data.analysis) {
          setAnalysis(data.analysis);
          if (data.usage) setTokenUsage(data.usage);
          // Add assistant response to conversation
          setConversationHistory((prev) => [
            ...prev,
            { role: "assistant", content: data.rawText || "" },
          ]);
        }
      } catch {
        setError("Network error. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    },
    [apiKey]
  );

  const handleImageCapture = useCallback(
    (base64: string, mediaType: string) => {
      setImagePreview(`data:${mediaType};base64,${base64}`);
      setAnalysis(null);
      setError(null);
      setConversationHistory([]);
      setRefinementHistory([]);

      // Build initial message with image
      const userMessage: ConversationMessage = {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType as ImageBlock["source"]["media_type"],
              data: base64,
            },
          },
          {
            type: "text",
            text: "Analyze this meal and provide a complete nutritional breakdown.",
          },
        ],
      };

      const messages = [userMessage];
      setConversationHistory(messages);
      analyzeImage(messages);
    },
    [analyzeImage]
  );

  const handleRefinement = useCallback(
    (text: string) => {
      if (!imagePreview || loading) return;

      setRefinementHistory((prev) => [...prev, { role: "user", text }]);

      const refinementText = buildRefinementMessage(text);
      const newMessage: ConversationMessage = {
        role: "user",
        content: refinementText,
      };

      // Token optimization: strip the image from the first message on refinements.
      // The model already has the full analysis in the assistant response, so it
      // doesn't need the image again — this saves ~1,500 tokens per refinement.
      const optimizedHistory = conversationHistory.map((msg, i) => {
        if (i === 0 && Array.isArray(msg.content)) {
          return {
            ...msg,
            content: msg.content.filter((block) => block.type !== "image"),
          };
        }
        return msg;
      });

      const updatedHistory = [...optimizedHistory, newMessage];
      setConversationHistory([...conversationHistory, newMessage]);

      analyzeImage(updatedHistory).then(() => {
        setRefinementHistory((prev) => [
          ...prev,
          { role: "assistant", text: "Analysis updated." },
        ]);
      });
    },
    [imagePreview, loading, conversationHistory, analyzeImage]
  );

  const handleClear = useCallback(() => {
    setImagePreview(null);
    setAnalysis(null);
    setError(null);
    setConversationHistory([]);
    setRefinementHistory([]);
    setTokenUsage(null);
  }, []);

  return (
    <div className="min-h-dvh bg-stone-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">Glucent</h1>
            <p className="text-[11px] text-muted-foreground -mt-0.5">AI Carb Counter for T1D</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowKeyModal(true)}
            className="rounded-full"
            aria-label="API key settings"
          >
            <Settings className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-lg px-4 py-6 pb-32 flex flex-col gap-6">
        <PhotoCapture
          imagePreview={imagePreview}
          onImageCapture={handleImageCapture}
          onClear={handleClear}
          disabled={loading}
        />

        {/* Error state */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading && <LoadingSkeleton />}

        {/* Results */}
        {analysis && !loading && (
          <>
            <MacroDisplay analysis={analysis} />
            <ItemBreakdown items={analysis.items} />
            <RefinementChat
              history={refinementHistory}
              onSend={handleRefinement}
              disabled={loading}
            />
            {tokenUsage && (
              <p className="text-center text-[11px] text-muted-foreground/60 tabular-nums font-mono">
                {tokenUsage.inputTokens.toLocaleString()} in / {tokenUsage.outputTokens.toLocaleString()} out
                {tokenUsage.cacheReadTokens > 0 && ` / ${tokenUsage.cacheReadTokens.toLocaleString()} cached`}
              </p>
            )}
          </>
        )}
      </main>

      {/* API Key Modal */}
      <ApiKeyInput
        open={showKeyModal}
        onOpenChange={setShowKeyModal}
        onKeySaved={setApiKey}
      />
    </div>
  );
}
