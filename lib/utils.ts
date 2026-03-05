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

const BASE_INSTRUCTION = `
IMPORTANT RULES:
- Summarize ONLY what is explicitly stated in the document. Do NOT add external information or hallucinate.
- Use clean, well-structured markdown formatting.
- Start with a strong descriptive title as the first line (no emoji in title).
- Use "# " for section headers.
- ALWAYS finish the summary cleanly. Never end mid-sentence or with a dangling emoji. If space is limited, cover fewer sections fully rather than leaving any section incomplete.`.trim()

const STYLE_PROMPTS: Record<SummaryStyle, string> = {
  viral: `You are an expert who makes complex documents easy, meaningful, and engaging to read.
Create a viral-style summary using emojis that match the document's context.

${BASE_INSTRUCTION}

# STRUCTURE
- 8–10 sections, each with 2–5 bullet points.
- Section headers: "# Header" — short and punchy.
- Every bullet: "- " followed by a relevant emoji, then the insight.
- No numbered lists, no sub-headers.

# TONE
Engaging, viral-friendly, shareable. Use simple but powerful explanations.
Write as if explaining to a smart friend over coffee.

# FORMAT EXAMPLE
# Key Discovery
- 🎯 This is how every bullet should look — a clear, insight-packed sentence
- 📌 Another concise point with real substance`,

  concise: `You are a precision editor. Distill the document into its absolute essentials in ~300 words.

${BASE_INSTRUCTION}

# STRUCTURE
- 4–6 sections with 2–3 bullet points each.
- Section headers: "# Header"
- Every bullet: "- " followed by one clear, complete sentence.
- No fluff, no filler, no repetition.

# TONE
Direct, executive-briefing style. Every word earns its place.
Imagine preparing a one-page brief for a CEO with 30 seconds to read.`,

  detailed: `You are a thorough research analyst. Create a comprehensive, in-depth summary.

${BASE_INSTRUCTION}

# STRUCTURE
- 10–12 sections with 3–5 points each.
- Use "# " for major sections and "## " for sub-sections where appropriate.
- Include context, data points, methodology details, and implications.
- Use bullet points ("- ") for lists, but feel free to include short explanatory paragraphs.
- Use **bold** for key terms and metrics.

# TONE
Informative, analytical, well-structured. Cover all major themes with depth.
Imagine writing a detailed briefing document for a domain expert.`,

  'bullet-points': `You are a structured note-taker. Organize the document into clean, scannable bullet points.

${BASE_INSTRUCTION}

# STRUCTURE
- 6–8 sections with 3–5 bullet points each.
- Section headers: "# Header"
- Every bullet: "- " followed by one clear, scannable point.
- No paragraphs, no prose — bullets only.
- Use **bold** for key terms. Use sub-bullets ("  - ") for supporting details when needed.

# TONE
Neutral, factual, highly scannable. Optimized for quick reference.
Think: study notes or a reference cheat sheet.`,

  academic: `You are a scholarly reviewer. Produce a formal, structured academic-style summary.

${BASE_INSTRUCTION}
- Do NOT fabricate or invent citations. Only reference sources explicitly mentioned in the document.
- If the document does not cite sources, do not add any.

# STRUCTURE
- Sections: "Background", "Methodology" (if applicable), "Key Findings", "Analysis", "Limitations" (if applicable), "Conclusions".
- Use "# " for sections and "## " for sub-sections.
- Use bullet points ("- ") or numbered lists ("1. ") as appropriate.
- Include specific data, figures, and findings from the document.

# TONE
Formal, objective, scholarly. Write as if preparing an academic review or abstract.
Prioritize precision and nuance over brevity.`,
}



export function getSystemPrompt(style: SummaryStyle = 'viral'): string {
  return STYLE_PROMPTS[style] || STYLE_PROMPTS.viral
}
