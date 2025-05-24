"use client"

import { create } from "zustand"
import { currentUser } from "@/lib/data"

interface CurrentUserState {
  user: {
    name: string
    email: string
    avatar: string
    isTeacher: boolean
  } | null
  setUser: (user: CurrentUserState["user"]) => void
}

export const useCurrentUser = create<CurrentUserState>((set) => ({
  user: currentUser,
  setUser: (user) => set({ user }),
}))

