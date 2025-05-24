"use client"

import type React from "react"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDate, getSubjectColors } from "@/lib/utils"
import { LikeButton } from "@/components/like-button"
import { Edit, Trash2 } from "lucide-react"
import { useEditPostModal } from "@/hooks/use-edit-post-modal"
import { useDeletePostDialog } from "@/hooks/use-delete-post-dialog"

interface Post {
  id: string
  title: string
  content: string
  author: {
    name: string
    avatar?: string
    email?: string
  }
  createdAt: Date
  subject?: string
  likes?: number
}

interface MyPostCardProps {
  post: Post
}

export function MyPostCard({ post }: MyPostCardProps) {
  const { openModal } = useEditPostModal()
  const { openDialog } = useDeletePostDialog()

  // Obter cores específicas para a matéria
  const subjectColors = post.subject
    ? getSubjectColors(post.subject)
    : {
        bg: "bg-gray-100",
        text: "text-gray-700",
        border: "border-gray-200",
      }

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    openModal(post)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    openDialog(post.id, post.title)
  }

  return (
    <Card
      className={`w-full overflow-hidden transition-all duration-300 border-brand-100 bg-white/90 backdrop-blur-sm ${post.subject ? subjectColors.border : ""}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-brand-200">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{post.author.name}</p>
            <p className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
          </div>
          {post.subject && (
            <div className={`ml-auto text-xs px-2.5 py-0.5 rounded-full ${subjectColors.bg} ${subjectColors.text}`}>
              {post.subject}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Link href={`/posts/${post.id}`} className="block">
          <h3 className="text-xl font-semibold mb-2 text-primary">{post.title}</h3>
          <p className="text-muted-foreground line-clamp-3">{post.content}</p>
        </Link>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between items-center">
        <LikeButton postId={post.id} initialLikes={post.likes || 0} size="sm" />

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700"
            onClick={handleEdit}
          >
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Excluir
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

