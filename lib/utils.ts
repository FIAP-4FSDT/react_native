import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from "crypto"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

// Função para gerar URL do Gravatar
export function getGravatarUrl(email: string, size = 80): string {
  const hash = crypto.createHash("md5").update(email.trim().toLowerCase()).digest("hex")

  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`
}

// Mapeamento de cores por matéria
export const subjectColors: Record<string, { bg: string; text: string; border: string }> = {
  Física: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  Literatura: {
    bg: "bg-pink-100",
    text: "text-pink-700",
    border: "border-pink-200",
  },
  Matemática: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  História: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  Biologia: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
  },
  Química: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
  },
  Geografia: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  Filosofia: {
    bg: "bg-indigo-100",
    text: "text-indigo-700",
    border: "border-indigo-200",
  },
  Sociologia: {
    bg: "bg-violet-100",
    text: "text-violet-700",
    border: "border-violet-200",
  },
  Artes: {
    bg: "bg-fuchsia-100",
    text: "text-fuchsia-700",
    border: "border-fuchsia-200",
  },
  "Educação Física": {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  Inglês: {
    bg: "bg-sky-100",
    text: "text-sky-700",
    border: "border-sky-200",
  },
  Espanhol: {
    bg: "bg-cyan-100",
    text: "text-cyan-700",
    border: "border-cyan-200",
  },
}

// Função para obter as cores de uma matéria
export function getSubjectColors(subject: string) {
  return (
    subjectColors[subject] || {
      bg: "bg-gray-100",
      text: "text-gray-700",
      border: "border-gray-200",
    }
  )
}

