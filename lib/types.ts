export interface FoodItem {
  name: string;
  estimatedPortionSize: string;
  carbs: number;
  fiber: number;
  netCarbs: number;
  protein: number;
  fat: number;
  calories: number;
  glycemicNote?: string;
}

export interface MealAnalysis {
  items: FoodItem[];
  totals: {
    carbs: number;
    fiber: number;
    netCarbs: number;
    protein: number;
    fat: number;
    calories: number;
  };
  confidence: "high" | "medium" | "low";
  confidenceReason: string;
  mealDescription: string;
  glycemicOverview?: string;
}

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string | Array<ContentBlock>;
}

export interface TextBlock {
  type: "text";
  text: string;
}

export interface ImageBlock {
  type: "image";
  source: {
    type: "base64";
    media_type: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
    data: string;
  };
}

export type ContentBlock = TextBlock | ImageBlock;

export interface AnalyzeRequest {
  messages: ConversationMessage[];
  apiKey: string;
}

export interface AnalyzeResponse {
  analysis?: MealAnalysis;
  rawText?: string;
  error?: string;
}
