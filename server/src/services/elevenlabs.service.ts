/** ElevenLabs integration placeholder — keep API keys server-side only. */
export function hasElevenLabs(): boolean {
  const key = process.env.ELEVENLABS_API_KEY;
  return typeof key === "string" && key.trim().length > 0;
}
