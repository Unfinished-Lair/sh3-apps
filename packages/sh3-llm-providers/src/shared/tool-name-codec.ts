/** OpenAI-compatible providers (DeepSeek included) validate function names
 *  against `^[a-zA-Z0-9_-]+$`; Gemini validates against
 *  `[a-zA-Z_][a-zA-Z0-9_-]{0,63}`. Both reject `.`, but sh3-ai tool names
 *  use `.` as the segment separator. We encode `.` → `__` on the wire and
 *  decode the inverse on incoming `function.name` / `functionCall.name`
 *  fields. Round-trip-safe for any sh3-ai-shaped name. */
export function encodeToolName(name: string): string {
  return name.replace(/\./g, '__');
}

export function decodeToolName(name: string): string {
  return name.replace(/__/g, '.');
}
