/** Minimal SSE event-frame splitter shared by both providers. Reads a
 *  ReadableStream byte-by-byte, splits on the `\r?\n\r?\n` event boundary,
 *  filters to lines that start with `data:`, and yields each `data` payload
 *  as a string (already trimmed; `[DONE]` and empty payloads filtered out).
 *
 *  Returns the raw concatenated text alongside as `rawTextRef.value` so
 *  callers can implement the JSON-array fallback (see Gemini's
 *  Content-Type quirk) without re-reading the stream.
 */
export async function* parseSseStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  rawTextRef?: { value: string },
): AsyncIterable<string> {
  const decoder = new TextDecoder();
  let buffer = '';

  function* eventDataLines(event: string): Iterable<string> {
    for (const line of event.split(/\r?\n/)) {
      if (!line.startsWith('data:')) continue;
      // SSE allows an optional single space after the colon; trim handles both.
      const data = line.slice(5).trim();
      if (!data || data === '[DONE]') continue;
      yield data;
    }
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    buffer += chunk;
    if (rawTextRef) rawTextRef.value += chunk;

    const events = buffer.split(/\r?\n\r?\n/);
    buffer = events.pop() ?? '';
    for (const event of events) {
      yield* eventDataLines(event);
    }
  }
  const tail = decoder.decode();
  buffer += tail;
  if (rawTextRef) rawTextRef.value += tail;

  if (buffer.trim().length > 0) {
    yield* eventDataLines(buffer);
  }
}
