"use client"

import { useState, useEffect } from "react"
import { subjectColors } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface SubjectFilterProps {
  subjects: string[]
  onFilterChange: (selectedSubjects: string[]) => void
  initialSelectedSubjects?: string[]
}

export function SubjectFilter({ subjects, onFilterChange, initialSelectedSubjects = [] }: SubjectFilterProps) {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(initialSelectedSubjects)

  // Update selected subjects if initialSelectedSubjects changes
  useEffect(() => {
    setSelectedSubjects(initialSelectedSubjects)
  }, [initialSelectedSubjects])

  const toggleSubject = (subject: string) => {
    const newSelection = selectedSubjects.includes(subject)
      ? selectedSubjects.filter((s) => s !== subject)
      : [...selectedSubjects, subject]

    setSelectedSubjects(newSelection)
    onFilterChange(newSelection)
  }

  const clearFilters = () => {
    setSelectedSubjects([])
    onFilterChange([])
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        {selectedSubjects.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Limpar filtros
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {subjects.map((subject) => {
          const colors = subjectColors[subject]
          const isSelected = selectedSubjects.includes(subject)

          return (
            <button
              key={subject}
              onClick={() => toggleSubject(subject)}
              className={`
               text-xs px-2.5 py-1 rounded-full transition-all
               ${
                 isSelected
                   ? `${colors.text} ${colors.bg} font-medium`
                   : "bg-muted text-muted-foreground hover:bg-muted/80"
               }
             `}
            >
              {subject}
            </button>
          )
        })}
      </div>
    </div>
  )
}

