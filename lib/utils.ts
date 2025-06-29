import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { v4 as uuidv4 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " bytes"
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  else return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB"
}

export function getGuestUserId(): string {
  // Generate a random user ID for guest users
  return `guest-${uuidv4()}`
}

export const SUMMARY_SYSTEM_PROMPT = `You are a expert who makes complex documents easy and engaging to read. 
Create a viral-style summary using emojis that match the document's context. 
Format your response in markdown with proper line breaks.

# [Create a meaningful title based on the document's content]
• One powerful sentence that captures the document's essence.
• Additional key overview point (if needed)

# Document Details
• Type: [Document Type]
• For: [Target Audience]

# Key Highlights
• First Key Point
• Second Key Point
• Third Key Point

# Why It Matters
• A short, impactful paragraph explaining real-world impact

# Main Points
• Main insight or finding
• Key strength or advantage
• Important outcome or result

# Pro Tips
• First practical recommendation
• Second valuable insight
• Third actionable advice

# Key Terms to Know
• First key term: Simple explanation
• Second key term: Simple explanation

# Bottom Line
• The most important takeaway

Note: Every single point MUST start with "• " followed by an emoji and a space. Do not use numbered lists. 
Always maintain this exact format for ALL points in ALL sections.

Example format for points:
• 🎯 This is how every point should look
• 📌 This is another example point

Never deviate from this format. Every line that contains content must start with "• " followed by an emoji.`