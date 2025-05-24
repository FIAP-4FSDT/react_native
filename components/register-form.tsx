"use client"

import Link from "next/link"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { FormError } from "@/components/ui/form-error"
import { FormSuccess } from "@/components/ui/form-success"
import { isValidEmail, isNotEmpty, isValidName, getPasswordStrengthFeedback, passwordsMatch } from "@/lib/validation"

export function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [userType, setUserType] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Form validation state
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
    userType?: string
    acceptTerms?: string
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

  const validateForm = (): boolean => {
    const newErrors: {
      name?: string
      email?: string
      password?: string
      confirmPassword?: string
      userType?: string
      acceptTerms?: string
      general?: string
    } = {}

    // Validate name
    if (!isNotEmpty(name)) {
      newErrors.name = "O nome é obrigatório"
    } else if (!isValidName(name)) {
      newErrors.name = "O nome deve conter apenas letras"
    }

    // Validate email
    if (!isNotEmpty(email)) {
      newErrors.email = "O email é obrigatório"
    } else if (!isValidEmail(email)) {
      newErrors.email = "Formato de email inválido"
    }

    // Validate user type
    if (!userType) {
      newErrors.userType = "Selecione o tipo de usuário"
    }

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

    // Validate terms acceptance
    if (!acceptTerms) {
      newErrors.acceptTerms = "Você deve aceitar os termos de uso"
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
      // Simulate registration API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accessToken": ''
        },
        body: JSON.stringify({
          nome: name,
          email,
          senha: password,
          tipo_usuario: userType,
          confirmacao_senha: confirmPassword,
        }),
      })
      console.log(response)
      console.log(await response.json())
      console.log(JSON.stringify({
        nome: name,
        email,
        senha: password,
        tipo_usuario: userType,
        confirmacao_senha: confirmPassword,
      }))
      if (!response.ok) {
        setErrors({
          general: "Ocorreu um erro ao criar sua conta. Tente novamente.",
        })
        return
      }

      // For demo purposes, let's consider a successful registration
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo ao Portal Educacional.",
      })

      // Redirect to login page
      router.push("/login")
    } catch (error) {
      setErrors({
        general: "Ocorreu um erro ao criar sua conta. Tente novamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    // Clear error when user types
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }))
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    // Clear error when user types
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }))
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

  const handleUserTypeChange = (value: string) => {
    setUserType(value)
    // Clear error when user selects
    if (errors.userType) {
      setErrors((prev) => ({ ...prev, userType: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors.general && (
        <div className="bg-destructive/10 p-3 rounded-md border border-destructive">
          <FormError message={errors.general} />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
          Nome completo
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Seu nome completo"
          value={name}
          onChange={handleNameChange}
          disabled={isLoading}
          className={errors.name ? "border-destructive focus-visible:ring-destructive" : "border-brand-200"}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && <FormError message={errors.name} />}
      </div>

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
        {errors.email && <FormError message={errors.email} />}
      </div>

      <div className="space-y-2">
        <Label htmlFor="userType" className={errors.userType ? "text-destructive" : ""}>
          Tipo de usuário
        </Label>
        <Select value={userType} onValueChange={handleUserTypeChange} disabled={isLoading}>
          <SelectTrigger
            className={errors.userType ? "border-destructive focus-visible:ring-destructive" : "border-brand-200"}
            aria-invalid={!!errors.userType}
            aria-describedby={errors.userType ? "userType-error" : undefined}
          >
            <SelectValue placeholder="Selecione seu perfil" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="aluno">Estudante</SelectItem>
            <SelectItem value="professor">Professor</SelectItem>
          </SelectContent>
        </Select>
        {errors.userType && <FormError message={errors.userType}/>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className={errors.password ? "text-destructive" : ""}>
          Senha
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
        {errors.password && <FormError message={errors.password} />}
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
          Confirmar senha
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
        {errors.confirmPassword && <FormError message={errors.confirmPassword}/>}
        {confirmPassword && password === confirmPassword && !errors.confirmPassword && (
          <FormSuccess message="Senhas conferem" />
        )}
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox
          id="terms"
          checked={acceptTerms}
          onCheckedChange={(checked) => {
            setAcceptTerms(checked as boolean)
            // Clear error when user checks
            if (errors.acceptTerms) {
              setErrors((prev) => ({ ...prev, acceptTerms: undefined }))
            }
          }}
          disabled={isLoading}
          className={errors.acceptTerms ? "border-destructive" : ""}
          aria-invalid={!!errors.acceptTerms}
          aria-describedby={errors.acceptTerms ? "terms-error" : undefined}
        />
        <div className="space-y-1">
          <Label
            htmlFor="terms"
            className={`text-sm font-normal cursor-pointer ${errors.acceptTerms ? "text-destructive" : ""}`}
          >
            Eu aceito os{" "}
            <Link href="/terms" className="text-primary hover:text-primary/80 font-medium">
              termos de uso
            </Link>{" "}
            e{" "}
            <Link href="/privacy" className="text-primary hover:text-primary/80 font-medium">
              política de privacidade
            </Link>
          </Label>
          {errors.acceptTerms && <FormError message={errors.acceptTerms}/>}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Criando conta...
          </>
        ) : (
          "Criar conta"
        )}
      </Button>
    </form>
  )
}

