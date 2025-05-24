"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { currentUser } from "@/lib/data"
import { FormError } from "@/components/ui/form-error"
import { isNotEmpty } from "@/lib/validation"

interface CommentFormProps {
  onSubmit: (content: string) => void
  placeholder?: string
  buttonText?: string
  autoFocus?: boolean
  onCancel?: () => void
  showCancel?: boolean
}

export function CommentForm({
  onSubmit,
  placeholder = "Adicione um comentário...",
  buttonText = "Comentar",
  autoFocus = false,
  onCancel,
  showCancel = false,
}: CommentFormProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Form validation state
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [autoFocus])

  const validateForm = (): boolean => {
    if (!isNotEmpty(content)) {
      setError("O comentário não pode estar vazio")
      return false
    }

    if (content.length < 3) {
      setError("O comentário deve ter pelo menos 3 caracteres")
      return false
    }

    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Reset error
    setError(null)

    // Validate form
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simular um pequeno atraso para feedback visual
    setTimeout(() => {
      onSubmit(content)
      setContent("")
      setIsSubmitting(false)
    }, 300)
  }

  const handleCancel = () => {
    setContent("")
    setError(null)
    if (onCancel) {
      onCancel()
    }
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    // Clear error when user types
    if (error) {
      setError(null)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
        <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2">
        <Textarea
          ref={textareaRef}
          placeholder={placeholder}
          value={content}
          onChange={handleContentChange}
          className={
            error
              ? "min-h-[80px] resize-none border-destructive focus-visible:ring-destructive"
              : "min-h-[80px] resize-none border-brand-200 focus-visible:ring-primary/50"
          }
          disabled={isSubmitting}
          aria-invalid={!!error}
          aria-describedby={error ? "comment-error" : undefined}
        />
        {error && <FormError message={error} id="comment-error" />}

        <div className="flex justify-end gap-2">
          {showCancel && (
            <Button type="button" variant="outline" size="sm" onClick={handleCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
          )}

          <Button type="submit" size="sm" disabled={!content.trim() || isSubmitting}>
            {isSubmitting ? "Enviando..." : buttonText}
          </Button>
        </div>
      </div>
    </form>
  )
}

