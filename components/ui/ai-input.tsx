"use client"

import * as React from "react"
import { Send, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface AIInputProps {
  placeholder?: string
  onSubmit?: (message: string) => void
  loading?: boolean
  className?: string
}

export function AIInput({ 
  placeholder = "Ask me anything renewable energy.", 
  onSubmit, 
  loading = false,
  className 
}: AIInputProps) {
  const [message, setMessage] = React.useState("")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    if (message.trim() && onSubmit && !loading) {
      onSubmit(message.trim())
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  return (
    <div className={cn("relative", className)}>
      <div className="relative flex items-end rounded-lg border bg-background shadow-sm">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={loading}
          className="min-h-[44px] max-h-[120px] w-full resize-none rounded-l-lg border-0 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed"
          style={{ height: "44px" }}
        />
        <Button
          onClick={handleSubmit}
          disabled={!message.trim() || loading}
          size="icon"
          className="rounded-l-none rounded-r-lg h-[44px] w-[44px]"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
      {!message.trim() && !loading && (
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Ready to submit!
        </p>
      )}
    </div>
  )
}
