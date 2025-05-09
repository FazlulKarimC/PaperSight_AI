"use client"

import { toast } from "sonner"
import { Download } from "lucide-react"
import { Button } from "./button"

interface DownloadSummaryProps {
  title: string
  content: string
}

export function DownloadSummary({ title, content }: DownloadSummaryProps) {
  const handleDownload = () => {
    try {
      // Format the content with title and metadata
      const formattedContent = `Title: ${title}
Generated by: PaperSight AI
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}
----------------------------------------

${content}`
      
      // Create blob from formatted content
      const blob = new Blob([formattedContent], { type: 'text/plain' })
      
      // Create temporary link element
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_summary.txt`
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success("Summary downloaded successfully")
    } catch (error) {
      console.error('Error downloading summary:', error)
      toast.error("Failed to download summary")
    }
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="text-pink-500 hover:text-pink-600"
      onClick={handleDownload}
    >
      <Download className="mr-2 h-4 w-4" />
      Download Summary
    </Button>
  )
}