"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCreatePostModal } from "@/hooks/use-create-post-modal"

interface CreatePostButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "floating"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function CreatePostButton({ variant = "default", size = "default", className }: CreatePostButtonProps) {
  const { openModal } = useCreatePostModal()

  if (variant === "floating") {
    return (
      <Button
        onClick={openModal}
        size="icon"
        className="fixed bottom-20 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50 bg-primary hover:bg-primary/90"
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Criar Post</span>
      </Button>
    )
  }

  return (
    <Button onClick={openModal} variant={variant} size={size} className={className}>
      <Plus className="h-4 w-4 mr-2" />
      Criar Post
    </Button>
  )
}

