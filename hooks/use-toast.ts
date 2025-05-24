"use client"

import type React from "react"

// Adapted from: https://ui.shadcn.com/docs/components/toast
import { useState, useEffect, useCallback } from "react"

import type { ToastActionElement, ToastProps } from "@/components/ui/toast"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function generateId() {
  return `${count++}`
}

// Simpler implementation without reducer
export function useToast() {
  const [toasts, setToasts] = useState<ToasterToast[]>([])

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = []

    toasts.forEach((toast) => {
      if (toast.open === false) {
        const timeout = setTimeout(() => {
          setToasts((prevToasts) => prevToasts.filter((t) => t.id !== toast.id))
        }, TOAST_REMOVE_DELAY)

        timeouts.push(timeout)
      }
    })

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout))
    }
  }, [toasts])

  const toast = useCallback(
    (props: Omit<ToasterToast, "id">) => {
      const id = generateId()

      const newToast = {
        ...props,
        id,
        open: true,
      }

      setToasts((prevToasts) => {
        const updatedToasts = [newToast, ...prevToasts].slice(0, TOAST_LIMIT)
        return updatedToasts
      })

      return {
        id,
        dismiss: () => {
          setToasts((prevToasts) => prevToasts.map((t) => (t.id === id ? { ...t, open: false } : t)))
        },
        update: (props: ToasterToast) => {
          setToasts((prevToasts) => prevToasts.map((t) => (t.id === id ? { ...t, ...props } : t)))
        },
      }
    },
    [setToasts],
  )

  const dismiss = useCallback(
    (id: string) => {
      setToasts((prevToasts) => prevToasts.map((t) => (t.id === id ? { ...t, open: false } : t)))
    },
    [setToasts],
  )

  return {
    toasts,
    toast,
    dismiss,
  }
}

