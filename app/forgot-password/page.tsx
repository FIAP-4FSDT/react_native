import Link from "next/link"
import type { Metadata } from "next"
import { ForgotPasswordForm } from "@/components/forgot-password-form"

export const metadata: Metadata = {
  title: "Recuperar Senha | Portal Educacional",
  description: "Recupere sua senha do Portal Educacional",
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-primary">Recuperar Senha</h1>
          <p className="text-muted-foreground mt-2">Enviaremos um link para redefinir sua senha</p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-brand-100 p-6 animate-fade-in">
          <ForgotPasswordForm />

          <div className="mt-6 pt-6 border-t border-brand-100 text-center text-sm text-muted-foreground">
            <p className="mb-2">
              <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
                Voltar para o login
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-8 text-sm text-muted-foreground animate-fade-in">
          <p>© {new Date().getFullYear()} Portal Educacional. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  )
}

