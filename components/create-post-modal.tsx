"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { useCreatePostModal } from "@/hooks/use-create-post-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { FormError } from "@/components/ui/form-error"
import { isNotEmpty } from "@/lib/validation"
import { createPost } from "@/lib/services"

export function CreatePostModal() {
  const { isOpen, closeModal } = useCreatePostModal()
  const router = useRouter()
  const { toast } = useToast()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form validation state
  const [errors, setErrors] = useState<{
    title?: string
    content?: string
    subject?: string
    general?: string
  }>({})

  const validateForm = (): boolean => {
    const newErrors: {
      title?: string
      content?: string
      subject?: string
      general?: string
    } = {}

    // Validate title
    if (!isNotEmpty(title)) {
      newErrors.title = "O título é obrigatório"
    } else if (title.length < 5) {
      newErrors.title = "O título deve ter pelo menos 5 caracteres"
    }

    // Validate content
    if (!isNotEmpty(content)) {
      newErrors.content = "O conteúdo é obrigatório"
    } else if (content.length < 20) {
      newErrors.content = "O conteúdo deve ter pelo menos 20 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setErrors({})

    // Validate form
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const postId = await createPost({
        title: title.trim(),
        content: content.trim(),
      })

      toast({
        title: "Post criado com sucesso!",
        description: "Seu post foi publicado.",
      })

      // Limpar formulário e fechar modal
      setTitle("")
      setContent("")
      closeModal()

      // Redirecionar para o novo post
      if (postId) {
        closeModal()
        router.push(`/posts/${postId}`)
      } else {
        router.refresh()
      }
    } catch (error) {
      setErrors({
        general: "Ocorreu um erro ao criar seu post. Tente novamente.",
      })

      toast({
        title: "Erro ao criar post",
        description: "Ocorreu um erro ao criar seu post. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    // Clear error when user types
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: undefined }))
    }
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    // Clear error when user types
    if (errors.content) {
      setErrors((prev) => ({ ...prev, content: undefined }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-primary">Criar Novo Post</h2>
          <Button variant="ghost" size="icon" onClick={closeModal} disabled={isSubmitting}>
            <X className="h-5 w-5" />
            <span className="sr-only">Fechar</span>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.general && (
            <div className="bg-destructive/10 p-3 rounded-md border border-destructive">
              <FormError message={errors.general} />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title" className={errors.title ? "text-destructive" : ""}>
              Título
            </Label>
            <Input
              id="title"
              value={title}
              onChange={handleTitleChange}
              placeholder="Digite o título do post"
              disabled={isSubmitting}
              className={errors.title ? "border-destructive focus-visible:ring-destructive" : "border-brand-200"}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "title-error" : undefined}
            />
            {errors.title && <FormError message={errors.title} />}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className={errors.content ? "text-destructive" : ""}>
              Conteúdo
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={handleContentChange}
              placeholder="Digite o conteúdo do post"
              disabled={isSubmitting}
              className={
                errors.content
                  ? "min-h-[200px] border-destructive focus-visible:ring-destructive"
                  : "min-h-[200px] border-brand-200"
              }
              aria-invalid={!!errors.content}
              aria-describedby={errors.content ? "content-error" : undefined}
            />
            {errors.content && <FormError message={errors.content} />}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={closeModal} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Publicando..." : "Publicar Post"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

