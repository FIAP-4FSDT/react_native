"use client"

import { create } from "zustand"

interface Post {
  id: string
  title: string
  content: string
  subject?: string
}

interface EditPostModalStore {
  isOpen: boolean
  post: Post | null
  openModal: (post: Post) => void
  closeModal: () => void
}

export const useEditPostModal = create<EditPostModalStore>((set) => ({
  isOpen: false,
  post: null,
  openModal: (post) => set({ isOpen: true, post }),
  closeModal: () => set({ isOpen: false, post: null }),
}))

