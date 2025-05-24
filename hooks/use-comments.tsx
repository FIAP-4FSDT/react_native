"use client"

import { useState, useEffect } from "react"
// import { v4 as uuidv4 } from "uuid"
import { currentUser } from "@/lib/data"

// Simple ID generator for demo purposes
function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export interface CommentAuthor {
  name: string
  avatar?: string
  email?: string
  isTeacher?: boolean
}

export interface Comment {
  id: string
  content: string
  author: CommentAuthor
  createdAt: Date
  likes: number
  replies: Reply[]
}

export interface Reply {
  id: string
  content: string
  author: CommentAuthor
  createdAt: Date
  likes: number
}

export function useComments(postId: string, initialComments: Comment[] = []) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  // Carregar comentários do localStorage na inicialização
  useEffect(() => {
    const storedComments = localStorage.getItem(`comments-${postId}`)
    if (storedComments) {
      try {
        // Converter strings de data de volta para objetos Date
        const parsedComments = JSON.parse(storedComments, (key, value) => {
          if (key === "createdAt") {
            return new Date(value)
          }
          return value
        })
        setComments(parsedComments)
      } catch (error) {
        console.error("Erro ao carregar comentários:", error)
      }
    } else if (initialComments.length > 0) {
      // Se não há comentários no localStorage mas temos comentários iniciais, usamos eles
      setComments(initialComments)
    }
  }, [postId, initialComments])

  // Salvar comentários no localStorage quando mudar
  useEffect(() => {
    if (comments.length > 0) {
      localStorage.setItem(`comments-${postId}`, JSON.stringify(comments))
    }
  }, [comments, postId])

  // Adicionar um novo comentário
  const addComment = (content: string) => {
    if (!content.trim()) return

    const newComment: Comment = {
      id: generateId(),
      content: content.trim(),
      author: currentUser,
      createdAt: new Date(),
      likes: 0,
      replies: [],
    }

    setComments((prev) => [newComment, ...prev])
  }

  // Adicionar uma resposta a um comentário
  const addReply = (commentId: string, content: string) => {
    if (!content.trim()) return

    const newReply: Reply = {
      id: generateId(),
      content: content.trim(),
      author: currentUser,
      createdAt: new Date(),
      likes: 0,
    }

    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...comment.replies, newReply],
          }
        }
        return comment
      }),
    )

    // Limpar estado de resposta
    setReplyingTo(null)
  }

  // Curtir um comentário
  const likeComment = (commentId: string) => {
    // Check if we've already incremented this comment's likes in this session
    // This is a backup to the UI prevention
    const likedCommentsStr = localStorage.getItem("likedComments") || "{}"
    const likedComments = JSON.parse(likedCommentsStr)

    if (likedComments[commentId]) {
      return // Already liked, do nothing
    }

    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.likes + 1,
          }
        }
        return comment
      }),
    )
  }

  // Curtir uma resposta
  const likeReply = (commentId: string, replyId: string) => {
    // Check if we've already incremented this reply's likes in this session
    // This is a backup to the UI prevention
    const likedRepliesStr = localStorage.getItem("likedReplies") || "{}"
    const likedReplies = JSON.parse(likedRepliesStr)

    if (likedReplies[replyId]) {
      return // Already liked, do nothing
    }

    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: comment.replies.map((reply) => {
              if (reply.id === replyId) {
                return {
                  ...reply,
                  likes: reply.likes + 1,
                }
              }
              return reply
            }),
          }
        }
        return comment
      }),
    )
  }

  // Descurtir um comentário
  const unlikeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId && comment.likes > 0) {
          return {
            ...comment,
            likes: comment.likes - 1,
          }
        }
        return comment
      }),
    )
  }

  // Descurtir uma resposta
  const unlikeReply = (commentId: string, replyId: string) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: comment.replies.map((reply) => {
              if (reply.id === replyId && reply.likes > 0) {
                return {
                  ...reply,
                  likes: reply.likes - 1,
                }
              }
              return reply
            }),
          }
        }
        return comment
      }),
    )
  }

  return {
    comments,
    replyingTo,
    setReplyingTo,
    addComment,
    addReply,
    likeComment,
    unlikeComment,
    likeReply,
    unlikeReply,
  }
}

