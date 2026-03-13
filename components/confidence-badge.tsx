"use client";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ConfidenceBadgeProps {
  confidence: "high" | "medium" | "low";
  reason: string;
}

const CONFIDENCE_STYLES = {
  high: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  medium: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  low: "bg-red-100 text-red-700 hover:bg-red-100",
} as const;

const CONFIDENCE_LABELS = {
  high: "High confidence",
  medium: "Medium confidence",
  low: "Low confidence",
} as const;

export function ConfidenceBadge({ confidence, reason }: ConfidenceBadgeProps) {
  return (
    <Tooltip>
      <TooltipTrigger className="cursor-help">
        <Badge variant="secondary" className={`text-xs font-medium ${CONFIDENCE_STYLES[confidence]}`}>
          {CONFIDENCE_LABELS[confidence]}
        </Badge>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs text-sm">
        {reason}
      </TooltipContent>
    </Tooltip>
  );
}
