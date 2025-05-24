"use client"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLikes } from "@/hooks/use-likes"
import { useEffect } from "react"
import { cn } from "@/lib/utils"

interface LikeButtonProps {
  postId: string
  initialLikes: number
  size?: "sm" | "md" | "lg"
  showCount?: boolean
  className?: string
}

export function LikeButton({ postId, initialLikes, size = "md", showCount = true, className }: LikeButtonProps) {
  const { isLiked, toggleLike, getLikeCount, initializePostLikes } = useLikes()

  // Inicializar contagem de curtidas
  useEffect(() => {
    initializePostLikes(postId, initialLikes)
  }, [postId, initialLikes, initializePostLikes])

  const liked = isLiked(postId)
  const likeCount = getLikeCount(postId)

  // Tamanhos do botão
  const sizeClasses = {
    sm: "h-8 gap-1",
    md: "h-9 gap-1.5",
    lg: "h-10 gap-2",
  }

  // Tamanhos do ícone
  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  // Tamanhos do texto
  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={(e) => {
        e.preventDefault() // Prevenir navegação se dentro de um link
        e.stopPropagation()
        toggleLike(postId)
      }}
      className={cn(
        sizeClasses[size],
        "px-2 hover:bg-rose-50 group",
        liked ? "text-rose-500" : "text-muted-foreground",
        className,
      )}
    >
      <Heart
        className={cn(
          iconSizes[size],
          "transition-all",
          liked ? "fill-rose-500" : "fill-none group-hover:fill-rose-200",
        )}
      />
      {showCount && (
        <span
          className={cn(
            textSizes[size],
            "font-medium transition-colors",
            liked ? "text-rose-500" : "text-muted-foreground group-hover:text-rose-500",
          )}
        >
          {likeCount}
        </span>
      )}
    </Button>
  )
}

