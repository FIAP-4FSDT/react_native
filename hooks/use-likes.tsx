"use client"

import { useState, useEffect } from "react"

// Hook para gerenciar curtidas
export function useLikes() {
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({})
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({})

  // Carregar curtidas do localStorage na inicialização
  useEffect(() => {
    const storedLikes = localStorage.getItem("likedPosts")
    if (storedLikes) {
      setLikedPosts(JSON.parse(storedLikes))
    }

    const storedCounts = localStorage.getItem("likeCounts")
    if (storedCounts) {
      setLikeCounts(JSON.parse(storedCounts))
    }
  }, [])

  // Salvar curtidas no localStorage quando mudar
  useEffect(() => {
    if (Object.keys(likedPosts).length > 0) {
      localStorage.setItem("likedPosts", JSON.stringify(likedPosts))
    }
  }, [likedPosts])

  // Salvar contagens no localStorage quando mudar
  useEffect(() => {
    if (Object.keys(likeCounts).length > 0) {
      localStorage.setItem("likeCounts", JSON.stringify(likeCounts))
    }
  }, [likeCounts])

  // Inicializar contagem de curtidas para um post
  const initializePostLikes = (postId: string, initialCount: number) => {
    setLikeCounts((prev) => {
      // Só inicializa se ainda não existir
      if (prev[postId] === undefined) {
        return { ...prev, [postId]: initialCount }
      }
      return prev
    })
  }

  // Alternar curtida em um post
  const toggleLike = (postId: string) => {
    const isCurrentlyLiked = likedPosts[postId]

    // Atualizar estado de curtida
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !isCurrentlyLiked,
    }))

    // Atualizar contagem
    setLikeCounts((prev) => ({
      ...prev,
      [postId]: prev[postId] + (isCurrentlyLiked ? -1 : 1),
    }))
  }

  // Verificar se um post está curtido
  const isLiked = (postId: string) => {
    return !!likedPosts[postId]
  }

  // Obter contagem de curtidas para um post
  const getLikeCount = (postId: string) => {
    return likeCounts[postId] || 0
  }

  return {
    isLiked,
    toggleLike,
    getLikeCount,
    initializePostLikes,
  }
}

