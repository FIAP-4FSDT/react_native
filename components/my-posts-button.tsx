"use client"

import { BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useCurrentUser } from "@/hooks/use-current-user"

interface MyPostsButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function MyPostsButton({ variant = "outline", size = "default", className }: MyPostsButtonProps) {
  const { user } = useCurrentUser()

  // Only show the button if the user is a professor
  if (!user || !user.isTeacher) {
    return null
  }

  return (
    <Button variant={variant} size={size} className={className} asChild>
      <Link href="/my-posts" className="flex items-center">
        <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
        <span className="inline-block">Meus Posts</span>
      </Link>
    </Button>
  )
}

