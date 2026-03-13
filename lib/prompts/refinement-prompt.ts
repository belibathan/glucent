/**
 * Wraps user refinement text to remind the model of the expected output format.
 * This is appended as context when the user sends a follow-up correction
 * (e.g., "that's actually brown rice, not white rice" or "the portion is closer to 2 cups").
 */
export function buildRefinementMessage(userText: string): string {
  return `The user wants to refine the previous analysis. Here is their correction:

"${userText}"

Apply their correction to the previous analysis. Return the COMPLETE updated JSON analysis with all items (not just the changed ones). Acknowledge the change in the mealDescription field.`;
}
