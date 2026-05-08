/** Strip every occurrence of `apiKey` from `message` so error envelopes
 *  echoed back to the user don't leak the credential. No-op when the key
 *  is empty (any non-trivial message would otherwise become solid '***'). */
export function redactKey(message: string, apiKey: string): string {
  if (!apiKey) return message;
  return message.split(apiKey).join('***');
}
