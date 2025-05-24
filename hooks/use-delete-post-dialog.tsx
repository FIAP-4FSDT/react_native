"use client"

import { create } from "zustand"

interface DeletePostDialogStore {
  isOpen: boolean
  postId: string | null
  postTitle: string | null
  openDialog: (postId: string, postTitle: string) => void
  closeDialog: () => void
}

export const useDeletePostDialog = create<DeletePostDialogStore>((set) => ({
  isOpen: false,
  postId: null,
  postTitle: null,
  openDialog: (postId, postTitle) => set({ isOpen: true, postId, postTitle }),
  closeDialog: () => set({ isOpen: false, postId: null, postTitle: null }),
}))

