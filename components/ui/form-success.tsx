import { CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormSuccessProps {
  message?: string
  className?: string
}

export function FormSuccess({ message, className }: FormSuccessProps) {
  if (!message) return null

  return (
    <div className={cn("flex items-center gap-2 text-green-600 text-sm mt-1.5", className)}>
      <CheckCircle2 className="h-3.5 w-3.5" />
      <span>{message}</span>
    </div>
  )
}

