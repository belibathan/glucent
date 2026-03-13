"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ConfidenceBadge } from "./confidence-badge";
import type { MealAnalysis } from "@/lib/types";

interface MacroDisplayProps {
  analysis: MealAnalysis;
}

export function MacroDisplay({ analysis }: MacroDisplayProps) {
  const { totals, confidence, confidenceReason, mealDescription, glycemicOverview } = analysis;

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      {/* Meal description + confidence */}
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted-foreground leading-relaxed">{mealDescription}</p>
        <ConfidenceBadge confidence={confidence} reason={confidenceReason} />
      </div>

      {/* Hero carb card */}
      <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
        <CardContent className="flex flex-col items-center py-6">
          <span className="text-5xl font-bold tabular-nums text-amber-700 font-mono">
            {totals.netCarbs}g
          </span>
          <span className="text-sm font-medium text-amber-600 mt-1">Net Carbs</span>
          <div className="flex gap-4 mt-3 text-xs text-amber-600/80">
            <span>Total carbs: {totals.carbs}g</span>
            <span>Fiber: {totals.fiber}g</span>
          </div>
        </CardContent>
      </Card>

      {/* Supporting macro row */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="flex flex-col items-center py-4">
            <span className="text-xl font-semibold tabular-nums font-mono text-foreground">
              {totals.protein}g
            </span>
            <span className="text-xs text-muted-foreground mt-0.5">Protein</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center py-4">
            <span className="text-xl font-semibold tabular-nums font-mono text-foreground">
              {totals.fat}g
            </span>
            <span className="text-xs text-muted-foreground mt-0.5">Fat</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center py-4">
            <span className="text-xl font-semibold tabular-nums font-mono text-foreground">
              {totals.calories}
            </span>
            <span className="text-xs text-muted-foreground mt-0.5">Calories</span>
          </CardContent>
        </Card>
      </div>

      {/* Glycemic overview */}
      {glycemicOverview && (
        <Card className="border-teal-200 bg-teal-50/50">
          <CardContent className="py-3 px-4">
            <p className="text-xs text-teal-700 leading-relaxed">
              <span className="font-medium">Glycemic note:</span> {glycemicOverview}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
