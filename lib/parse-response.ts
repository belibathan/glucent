import type { MealAnalysis, FoodItem } from "./types";

/**
 * Parses Claude's raw text response into a validated MealAnalysis object.
 * Handles edge cases like markdown code fences wrapping the JSON.
 */
export function parseAnalysisResponse(raw: string): MealAnalysis {
  // Strip markdown code fences if present (Claude sometimes adds them despite instructions)
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  }

  const parsed = JSON.parse(cleaned);

  // Validate required top-level fields
  if (!parsed.items || !Array.isArray(parsed.items)) {
    throw new Error("Response missing 'items' array");
  }
  if (!parsed.totals) {
    throw new Error("Response missing 'totals' object");
  }
  if (!parsed.confidence || !["high", "medium", "low"].includes(parsed.confidence)) {
    throw new Error("Response missing valid 'confidence' field");
  }

  // Validate and normalize each food item
  const items: FoodItem[] = parsed.items.map((item: Record<string, unknown>, i: number) => {
    if (!item.name || typeof item.name !== "string") {
      throw new Error(`Item ${i} missing 'name'`);
    }
    return {
      name: item.name,
      estimatedPortionSize: String(item.estimatedPortionSize ?? "unknown"),
      carbs: Number(item.carbs ?? 0),
      fiber: Number(item.fiber ?? 0),
      netCarbs: Number(item.netCarbs ?? 0),
      protein: Number(item.protein ?? 0),
      fat: Number(item.fat ?? 0),
      calories: Number(item.calories ?? 0),
      glycemicNote: item.glycemicNote ? String(item.glycemicNote) : undefined,
    };
  });

  return {
    items,
    totals: {
      carbs: Number(parsed.totals.carbs ?? 0),
      fiber: Number(parsed.totals.fiber ?? 0),
      netCarbs: Number(parsed.totals.netCarbs ?? 0),
      protein: Number(parsed.totals.protein ?? 0),
      fat: Number(parsed.totals.fat ?? 0),
      calories: Number(parsed.totals.calories ?? 0),
    },
    confidence: parsed.confidence,
    confidenceReason: String(parsed.confidenceReason ?? ""),
    mealDescription: String(parsed.mealDescription ?? ""),
    glycemicOverview: parsed.glycemicOverview ? String(parsed.glycemicOverview) : undefined,
  };
}
