/** Best-effort extraction of a useful message from an HTTP error response.
 *  Both DeepSeek and Gemini surface their canonical error text under
 *  `error.message` in a JSON body; if the body isn't JSON we fall back to
 *  the HTTP status. */
export async function readErrorEnvelope(res: Response): Promise<string> {
  let envelopeMsg: string | undefined;
  try {
    const body = await res.json();
    envelopeMsg = body?.error?.message;
  } catch {
    // body wasn't JSON — fall through to status fallback
  }
  return envelopeMsg ?? `HTTP ${res.status}`;
}
