/**
 * Send an email
 * In a real application, this would use a service like SendGrid, Mailgun, etc.
 * This is a mock implementation for demonstration purposes
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}): Promise<{ success: boolean; error?: string }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  console.log(`Sending email to: ${to}`)
  console.log(`Subject: ${subject}`)
  console.log(`Content: ${html}`)

  // For demo purposes, we'll simulate success for valid-looking emails
  if (to.includes("@") && to.includes(".")) {
    return { success: true }
  }

  return {
    success: false,
    error: "Invalid email address",
  }
}

/**
 * Generate a password reset email
 */
export function generatePasswordResetEmail({
  email,
  resetToken,
  baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
}: {
  email: string
  resetToken: string
  baseUrl?: string
}): { subject: string; html: string } {
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`

  const subject = "Redefinição de Senha - Portal Educacional"

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2dcd2; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #8c7a63; margin-bottom: 10px;">Portal Educacional</h1>
        <p style="color: #726452; font-size: 16px;">Redefinição de Senha</p>
      </div>
      
      <div style="margin-bottom: 30px; color: #5f5446;">
        <p>Olá,</p>
        <p>Recebemos uma solicitação para redefinir a senha da sua conta no Portal Educacional. Para prosseguir com a redefinição, clique no botão abaixo:</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #8c7a63; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Redefinir Senha</a>
      </div>
      
      <div style="margin-bottom: 30px; color: #5f5446;">
        <p>Se você não solicitou a redefinição de senha, por favor ignore este e-mail ou entre em contato com nossa equipe de suporte.</p>
        <p>Este link expirará em 1 hora por motivos de segurança.</p>
      </div>
      
      <div style="border-top: 1px solid #e2dcd2; padding-top: 20px; color: #726452; font-size: 14px; text-align: center;">
        <p>Se o botão acima não funcionar, copie e cole o link abaixo em seu navegador:</p>
        <p style="word-break: break-all; color: #8c7a63;">${resetUrl}</p>
      </div>
      
      <div style="margin-top: 30px; text-align: center; color: #726452; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} Portal Educacional. Todos os direitos reservados.</p>
      </div>
    </div>
  `

  return { subject, html }
}

