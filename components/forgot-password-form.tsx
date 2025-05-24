"use client"

import type React from "react"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { requestPasswordReset } from "@/lib/actions"
import { FormError } from "@/components/ui/form-error"
import { isValidEmail, isNotEmpty } from "@/lib/validation"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  // Form validation state
  const [errors, setErrors] = useState<{
    email?: string
    general?: string
  }>({})

  const validateForm = (): boolean => {
    const newErrors: {
      email?: string
      general?: string
    } = {}

    // Validate email
    if (!isNotEmpty(email)) {
      newErrors.email = "O email é obrigatório"
    } else if (!isValidEmail(email)) {
      newErrors.email = "Formato de email inválido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setErrors({})

    // Validate form
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Call the server action to request password reset
      const result = await requestPasswordReset(email)

      if (result.success) {
        setIsSubmitted(true)
        toast({
          title: "Email enviado com sucesso!",
          description: "Verifique sua caixa de entrada para redefinir sua senha.",
        })
      } else {
        throw new Error(result.error || "Erro ao enviar email de recuperação")
      }
    } catch (error) {
      setErrors({
        general: "Ocorreu um erro ao enviar o email de recuperação. Tente novamente.",
      })

      toast({
        title: "Erro ao enviar email",
        description: "Não foi possível enviar o email de recuperação. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    // Clear error when user types
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }))
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-4">
        <h3 className="text-lg font-medium text-primary mb-2">Email enviado!</h3>
        <p className="text-muted-foreground mb-4">
          Enviamos um link de recuperação para <strong>{email}</strong>. Verifique sua caixa de entrada e siga as
          instruções para redefinir sua senha.
        </p>
        <Button onClick={() => setIsSubmitted(false)} variant="outline">
          Tentar com outro email
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors.general && (
        <div className="bg-destructive/10 p-3 rounded-md border border-destructive">
          <FormError message={errors.general} />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="seu.email@exemplo.com"
          value={email}
          onChange={handleEmailChange}
          disabled={isLoading}
          className={errors.email ? "border-destructive focus-visible:ring-destructive" : "border-brand-200"}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && <FormError message={errors.email} id="email-error" />}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          "Enviar link de recuperação"
        )}
      </Button>
    </form>
  )
}

