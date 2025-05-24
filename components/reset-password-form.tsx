"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { resetPassword } from "@/lib/actions"
import { FormError } from "@/components/ui/form-error"
import { FormSuccess } from "@/components/ui/form-success"
import { isNotEmpty, getPasswordStrengthFeedback, passwordsMatch } from "@/lib/validation"

interface ResetPasswordFormProps {
  token?: string
  email?: string
}

export function ResetPasswordForm({ token, email }: ResetPasswordFormProps) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isValid, setIsValid] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Form validation state
  const [errors, setErrors] = useState<{
    password?: string
    confirmPassword?: string
    general?: string
  }>({})

  // Password strength feedback
  const [passwordFeedback, setPasswordFeedback] = useState<{
    isStrong: boolean
    feedback: string
  } | null>(null)

  // Update password feedback when password changes
  useEffect(() => {
    if (password) {
      setPasswordFeedback(getPasswordStrengthFeedback(password))
    } else {
      setPasswordFeedback(null)
    }
  }, [password])

  // Check if token and email are provided
  useEffect(() => {
    if (!token || !email) {
      setIsValid(false)
    }
  }, [token, email])

  const validateForm = (): boolean => {
    const newErrors: {
      password?: string
      confirmPassword?: string
      general?: string
    } = {}

    // Validate password
    if (!isNotEmpty(password)) {
      newErrors.password = "A senha é obrigatória"
    } else if (passwordFeedback && !passwordFeedback.isStrong) {
      newErrors.password = passwordFeedback.feedback
    }

    // Validate confirm password
    if (!isNotEmpty(confirmPassword)) {
      newErrors.confirmPassword = "Confirme sua senha"
    } else if (!passwordsMatch(password, confirmPassword)) {
      newErrors.confirmPassword = "As senhas não conferem"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token || !email) {
      toast({
        title: "Link inválido",
        description: "O link de redefinição de senha é inválido ou expirou.",
        variant: "destructive",
      })
      return
    }

    // Reset errors
    setErrors({})

    // Validate form
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const result = await resetPassword({
        email,
        token,
        newPassword: password,
      })

      if (result.success) {
        toast({
          title: "Senha redefinida com sucesso!",
          description: "Sua senha foi atualizada. Você já pode fazer login com sua nova senha.",
        })

        // Redirect to login page
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        throw new Error(result.error || "Erro ao redefinir senha")
      }
    } catch (error) {
      setErrors({
        general: "O link de redefinição é inválido ou expirou. Por favor, solicite um novo link.",
      })

      toast({
        title: "Erro ao redefinir senha",
        description: "O link de redefinição é inválido ou expirou. Por favor, solicite um novo link.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    // Clear error when user types
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }))
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
    // Clear error when user types
    if (errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
    }
  }

  if (!isValid) {
    return (
      <div className="text-center py-4">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-primary mb-2">Link inválido</h3>
        <p className="text-muted-foreground mb-6">
          O link de redefinição de senha é inválido ou expirou. Por favor, solicite um novo link de redefinição.
        </p>
        <Button asChild>
          <a href="/forgot-password">Solicitar novo link</a>
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
        <Label htmlFor="password" className={errors.password ? "text-destructive" : ""}>
          Nova senha
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={handlePasswordChange}
            disabled={isLoading}
            className={
              errors.password ? "border-destructive focus-visible:ring-destructive pr-10" : "border-brand-200 pr-10"
            }
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-primary"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="sr-only">{showPassword ? "Ocultar senha" : "Mostrar senha"}</span>
          </Button>
        </div>
        {errors.password && <FormError message={errors.password} id="password-error" />}
        {passwordFeedback &&
          password &&
          !errors.password &&
          (passwordFeedback.isStrong ? (
            <FormSuccess message={passwordFeedback.feedback} />
          ) : (
            <FormError message={passwordFeedback.feedback} />
          ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className={errors.confirmPassword ? "text-destructive" : ""}>
          Confirmar nova senha
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            disabled={isLoading}
            className={
              errors.confirmPassword
                ? "border-destructive focus-visible:ring-destructive pr-10"
                : "border-brand-200 pr-10"
            }
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-primary"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="sr-only">{showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}</span>
          </Button>
        </div>
        {errors.confirmPassword && <FormError message={errors.confirmPassword} id="confirmPassword-error" />}
        {confirmPassword && password === confirmPassword && !errors.confirmPassword && (
          <FormSuccess message="Senhas conferem" />
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Redefinindo senha...
          </>
        ) : (
          "Redefinir senha"
        )}
      </Button>
    </form>
  )
}

