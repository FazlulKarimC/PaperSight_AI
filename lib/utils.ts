import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// ── Summary Style System ──────────────────────────────────────────
export type SummaryStyle = 'viral' | 'concise' | 'detailed' | 'bullet-points' | 'academic'

export const SUMMARY_STYLES: { value: SummaryStyle; label: string; description: string; icon: string }[] = [
  { value: 'viral', label: 'Viral', description: 'Engaging & shareable with emojis', icon: '🔥' },
  { value: 'concise', label: 'Concise', description: 'Brief key takeaways', icon: '⚡' },
  { value: 'detailed', label: 'Detailed', description: 'Comprehensive deep-dive', icon: '📖' },
  { value: 'bullet-points', label: 'Bullet Points', description: 'Clean structured bullets', icon: '📋' },
  { value: 'academic', label: 'Academic', description: 'Formal scholarly tone', icon: '🎓' },
]

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Counts the number of words in a text string.
 * Single source of truth — use this instead of inline split/filter calls.
 */
export function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " bytes"
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  else return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB"
}



// ── Reading Time Utilities ────────────────────────────────────────
const WORDS_PER_MINUTE = 238  // average adult reading speed

export function calculateReadingTime(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE))
}

export function calculateTimeSaved(originalWordCount: number, summaryWordCount: number) {
  const originalMinutes = calculateReadingTime(originalWordCount)
  const summaryMinutes = calculateReadingTime(summaryWordCount)
  const savedMinutes = Math.max(0, originalMinutes - summaryMinutes)
  const savedPercent = originalWordCount > 0 ? Math.round((1 - summaryWordCount / originalWordCount) * 100) : 0
  return { originalMinutes, summaryMinutes, savedMinutes, savedPercent }
}

// ── Style-Specific Prompts ────────────────────────────────────────
const STYLE_PROMPTS: Record<SummaryStyle, string> = {
  viral: `You are an expert who makes complex documents easy, meaningful, and engaging to read.
Create a viral-style summary using emojis that match the document's context.

# STRUCTURE: 8–10 sections, each with 2–5 bullet points.
• Section headers: "# Header"
• Every bullet: "• " + emoji + space + insight
• No numbered lists, no dashes.

# TONE: Engaging, viral-friendly, shareable. Use simple but powerful explanations.
# CONTENT: Strong title (no emoji), thematic sections, concise but insightful points.

Example:
• 🎯 This is how every point should look
• 📌 This is another example point`,

  concise: `You are a precision editor. Distill the document into its absolute essentials.

# STRUCTURE: 4–6 sections with 2–3 bullet points each.
• Section headers: "# Header"
• Every bullet: "• " + one clear sentence.
• Target: ~300 words total.

# TONE: Direct, no-fluff, executive-briefing style.
# CONTENT: Strong title, only the most critical information.`,

  detailed: `You are a thorough research analyst. Create a comprehensive summary.

# STRUCTURE: 10–12 sections with 3–5 bullet points each.
• Section headers: "# Header"
• Include context, data points, methodology, and implications.
• Every bullet: "• " + detailed explanation.

# TONE: Informative, analytical, well-structured.
# CONTENT: Strong title, deep coverage of all major themes.`,

  'bullet-points': `You are a structured note-taker. Organize the document into clean bullet points.

# STRUCTURE: 6–8 sections with 3–5 bullet points each.
• Section headers: "# Header"
• Every bullet: "• " + one clear, scannable point.
• No paragraphs, no prose — bullets only.

# TONE: Neutral, factual, scannable.
# CONTENT: Strong title, logical grouping of information.`,

  academic: `You are a scholarly reviewer. Produce a formal academic-style summary.

# STRUCTURE: 6–8 sections with 2–4 bullet points each.
• Section headers: "# Header" (e.g. "Methodology", "Key Findings", "Limitations")
• Every bullet: "• " + formal, precise language.
• Include citations where applicable.

# TONE: Formal, objective, scholarly.
# CONTENT: Strong title, structured like an abstract + review.`,
}



export function getSystemPrompt(style: SummaryStyle = 'viral'): string {
  return STYLE_PROMPTS[style] || STYLE_PROMPTS.viral
}