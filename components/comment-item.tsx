"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, Reply } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CommentForm } from "@/components/comment-form"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Comment, Reply as ReplyType } from "@/hooks/use-comments"

interface CommentItemProps {
  comment: Comment
  onReply: (commentId: string, content: string) => void
  onLike: (commentId: string) => void
  onUnlike: (commentId: string) => void
  onLikeReply: (commentId: string, replyId: string) => void
  onUnlikeReply: (commentId: string, replyId: string) => void
  replyingTo: string | null
  setReplyingTo: (commentId: string | null) => void
  isNested?: boolean
}

export function CommentItem({
  comment,
  onReply,
  onLike,
  onUnlike,
  onLikeReply,
  onUnlikeReply,
  replyingTo,
  setReplyingTo,
  isNested = false,
}: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(true)
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({})
  const [likedReplies, setLikedReplies] = useState<Record<string, boolean>>({})

  // Load liked state from localStorage on component mount
  useEffect(() => {
    const storedLikedComments = localStorage.getItem("likedComments")
    const storedLikedReplies = localStorage.getItem("likedReplies")

    if (storedLikedComments) {
      setLikedComments(JSON.parse(storedLikedComments))
    }

    if (storedLikedReplies) {
      setLikedReplies(JSON.parse(storedLikedReplies))
    }
  }, [])

  // Save liked state to localStorage when it changes
  useEffect(() => {
    if (Object.keys(likedComments).length > 0) {
      localStorage.setItem("likedComments", JSON.stringify(likedComments))
    }
  }, [likedComments])

  useEffect(() => {
    if (Object.keys(likedReplies).length > 0) {
      localStorage.setItem("likedReplies", JSON.stringify(likedReplies))
    }
  }, [likedReplies])

  const handleReply = (content: string) => {
    onReply(comment.id, content)
  }

  const toggleLike = () => {
    // Toggle the liked state
    const isCurrentlyLiked = likedComments[comment.id]

    setLikedComments((prev) => ({
      ...prev,
      [comment.id]: !isCurrentlyLiked,
    }))

    // Call the onLike function to update the like count
    if (!isCurrentlyLiked) {
      // Like the comment
      onLike(comment.id)
    } else {
      // Unlike the comment - we need to implement this in useComments
      onUnlike(comment.id)
    }
  }

  const toggleReplyLike = (replyId: string) => {
    // If already liked, don't allow liking again
    if (likedReplies[replyId]) {
      return
    }

    // Mark as liked
    setLikedReplies((prev) => ({
      ...prev,
      [replyId]: true,
    }))

    // Call the onLikeReply function to update the like count
    onLikeReply(comment.id, replyId)
  }

  const toggleReplies = () => {
    setShowReplies(!showReplies)
  }

  const formattedDate = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
    locale: ptBR,
  })

  return (
    <div className={cn("group animate-fade-in", isNested ? "pl-0" : "border-b border-brand-100 pb-4")}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
          <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{comment.author.name}</span>
            {comment.author.isTeacher && (
              <Badge variant="outline" className="text-xs py-0 h-5 bg-primary/10 text-primary border-primary/20">
                Professor
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </div>

          <div className="text-sm">{comment.content}</div>

          <div className="flex items-center gap-4 pt-1">
            <Button
              variant="ghost"
              size="sm"
              className={`h-6 px-2 text-xs ${
                likedComments[comment.id] ? "text-rose-500" : "text-muted-foreground hover:text-primary"
              }`}
              onClick={toggleLike}
            >
              <Heart className={`h-3.5 w-3.5 mr-1 ${likedComments[comment.id] ? "fill-rose-500" : "fill-none"}`} />
              {comment.likes > 0 && <span>{comment.likes}</span>}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-muted-foreground hover:text-primary"
              onClick={() => setReplyingTo(comment.id)}
            >
              <Reply className="h-3.5 w-3.5 mr-1" />
              Responder
            </Button>
          </div>

          {replyingTo === comment.id && (
            <div className="mt-3">
              <CommentForm
                onSubmit={handleReply}
                placeholder="Escreva uma resposta..."
                buttonText="Responder"
                autoFocus
                onCancel={() => setReplyingTo(null)}
                showCancel
              />
            </div>
          )}

          {comment.replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-muted-foreground hover:text-primary"
                  onClick={toggleReplies}
                >
                  {showReplies ? "Ocultar" : "Mostrar"} {comment.replies.length}{" "}
                  {comment.replies.length === 1 ? "resposta" : "respostas"}
                </Button>
              )}

              {showReplies && (
                <div className="space-y-3 pl-4 border-l-2 border-brand-100">
                  {comment.replies.map((reply) => (
                    <ReplyItem
                      key={reply.id}
                      reply={reply}
                      commentId={comment.id}
                      onLike={onLikeReply}
                      onUnlike={onUnlikeReply}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface ReplyItemProps {
  reply: ReplyType
  commentId: string
  onLike: (commentId: string, replyId: string) => void
  onUnlike: (commentId: string, replyId: string) => void
}

function ReplyItem({ reply, commentId, onLike, onUnlike }: ReplyItemProps) {
  const [likedReplies, setLikedReplies] = useState<Record<string, boolean>>({})

  // Load liked state from localStorage on component mount
  useEffect(() => {
    const storedLikedReplies = localStorage.getItem("likedReplies")

    if (storedLikedReplies) {
      setLikedReplies(JSON.parse(storedLikedReplies))
    }
  }, [])

  const toggleLike = () => {
    // Toggle the liked state
    const isCurrentlyLiked = likedReplies[reply.id]

    setLikedReplies((prev) => {
      const updated = {
        ...prev,
        [reply.id]: !isCurrentlyLiked,
      }

      // Save to localStorage
      localStorage.setItem("likedReplies", JSON.stringify(updated))

      return updated
    })

    // Call the appropriate function to update the like count
    if (!isCurrentlyLiked) {
      // Like the reply
      onLike(commentId, reply.id)
    } else {
      // Unlike the reply
      onUnlike(commentId, reply.id)
    }
  }

  const formattedDate = formatDistanceToNow(new Date(reply.createdAt), {
    addSuffix: true,
    locale: ptBR,
  })

  return (
    <div className="flex gap-3 animate-fade-in">
      <Avatar className="h-7 w-7 flex-shrink-0">
        <AvatarImage src={reply.author.avatar} alt={reply.author.name} />
        <AvatarFallback>{reply.author.name.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{reply.author.name}</span>
          {reply.author.isTeacher && (
            <Badge variant="outline" className="text-xs py-0 h-5 bg-primary/10 text-primary border-primary/20">
              Professor
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
        </div>

        <div className="text-sm">{reply.content}</div>

        <div className="flex items-center gap-4 pt-1">
          <Button
            variant="ghost"
            size="sm"
            className={`h-6 px-2 text-xs ${
              likedReplies[reply.id] ? "text-rose-500" : "text-muted-foreground hover:text-primary"
            }`}
            onClick={toggleLike}
          >
            <Heart className={`h-3.5 w-3.5 mr-1 ${likedReplies[reply.id] ? "fill-rose-500" : "fill-none"}`} />
            {reply.likes > 0 && <span>{reply.likes}</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}

