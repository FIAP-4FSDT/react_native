"use client"

import { useComments } from "@/hooks/use-comments"
import { CommentForm } from "@/components/comment-form"
import { CommentItem } from "@/components/comment-item"
import { Separator } from "@/components/ui/separator"
import type { Comment } from "@/hooks/use-comments"

interface CommentsSectionProps {
  postId: string
  initialComments: Comment[]
}

export function CommentsSection({ postId, initialComments }: CommentsSectionProps) {
  const {
    comments,
    replyingTo,
    setReplyingTo,
    addComment,
    addReply,
    likeComment,
    unlikeComment,
    likeReply,
    unlikeReply,
  } = useComments(postId, initialComments)

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6 animate-fade-in">
      <h3 className="text-xl font-semibold mb-6 text-primary">Comentários ({comments.length})</h3>

      <div className="mb-6">
        <CommentForm onSubmit={addComment} />
      </div>

      <Separator className="my-6" />

      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={addReply}
              onLike={likeComment}
              onUnlike={unlikeComment}
              onLikeReply={likeReply}
              onUnlikeReply={unlikeReply}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Seja o primeiro a comentar neste post!</p>
        </div>
      )}
    </div>
  )
}

