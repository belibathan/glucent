"use client";

import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import type { FoodItem } from "@/lib/types";

interface ItemBreakdownProps {
  items: FoodItem[];
}

function ItemRow({ item }: { item: FoodItem }) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-colors hover:bg-muted/50">
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium">{item.name}</span>
          <span className="ml-2 text-xs text-muted-foreground">{item.estimatedPortionSize}</span>
        </div>
        <div className="flex items-center gap-3 ml-3">
          <span className="text-sm font-semibold tabular-nums font-mono text-amber-700">
            {item.netCarbs}g
          </span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-4 pb-3 pt-1">
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Carbs</span>
              <span className="tabular-nums font-mono">{item.carbs}g</span>
            </div>
            <div className="flex justify-between">
              <span>Fiber</span>
              <span className="tabular-nums font-mono">{item.fiber}g</span>
            </div>
            <div className="flex justify-between">
              <span>Net carbs</span>
              <span className="tabular-nums font-mono">{item.netCarbs}g</span>
            </div>
            <div className="flex justify-between">
              <span>Protein</span>
              <span className="tabular-nums font-mono">{item.protein}g</span>
            </div>
            <div className="flex justify-between">
              <span>Fat</span>
              <span className="tabular-nums font-mono">{item.fat}g</span>
            </div>
            <div className="flex justify-between">
              <span>Calories</span>
              <span className="tabular-nums font-mono">{item.calories}</span>
            </div>
          </div>
          {item.glycemicNote && (
            <p className="mt-2 text-xs text-teal-600 italic">{item.glycemicNote}</p>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function ItemBreakdown({ items }: ItemBreakdownProps) {
  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-medium text-foreground">Item Breakdown</h3>
      </div>
      <div className="divide-y divide-border">
        {items.map((item, i) => (
          <ItemRow key={`${item.name}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}
