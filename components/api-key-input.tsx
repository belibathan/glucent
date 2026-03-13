"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { API_KEY_STORAGE_KEY } from "@/lib/constants";

interface ApiKeyInputProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onKeySaved: (key: string) => void;
}

export function ApiKeyInput({ open, onOpenChange, onKeySaved }: ApiKeyInputProps) {
  const [key, setKey] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (stored) setKey(stored);
  }, [open]);

  function handleSave() {
    const trimmed = key.trim();
    if (!trimmed) return;
    localStorage.setItem(API_KEY_STORAGE_KEY, trimmed);
    onKeySaved(trimmed);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Anthropic API Key</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Your key is stored locally in your browser and sent directly to Anthropic. It never touches our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-2">
          <Input
            type="password"
            placeholder="sk-ant-..."
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
          <div className="flex items-center justify-between">
            <a
              href="https://console.anthropic.com/settings/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-teal-600 hover:underline"
            >
              Get an API key
            </a>
            <Button onClick={handleSave} disabled={!key.trim()}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
