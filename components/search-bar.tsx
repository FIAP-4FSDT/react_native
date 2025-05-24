"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  initialQuery?: string
}

export function SearchBar({ initialQuery = "" }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialQuery)
  const router = useRouter()

  // Update searchTerm if initialQuery changes
  useEffect(() => {
    setSearchTerm(initialQuery)
  }, [initialQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
    }
  }

  const handleClear = () => {
    setSearchTerm("")
    // If we're already on the search page and clear the input, focus it
    if (typeof document !== "undefined") {
      const input = document.querySelector('input[type="text"]') as HTMLInputElement
      if (input) input.focus()
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative flex items-center">
        <Input
          type="text"
          placeholder="Buscar por título ou professor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-20 border-brand-200 focus-visible:ring-primary/50 transition-all"
        />
        {searchTerm && (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleClear}
            className="absolute right-8 text-muted-foreground hover:text-primary hover:bg-secondary/50"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Limpar busca</span>
          </Button>
        )}
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          className="absolute right-0 text-muted-foreground hover:text-primary hover:bg-secondary/50"
          disabled={!searchTerm.trim()}
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">Buscar</span>
        </Button>
      </div>
    </form>
  )
}

