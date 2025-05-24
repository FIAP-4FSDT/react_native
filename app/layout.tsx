import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeToggle } from "@/components/theme-toggle"
import { CreatePostModal } from "@/components/create-post-modal"
import { EditPostModal } from "@/components/edit-post-modal"
import { DeletePostDialog } from "@/components/delete-post-dialog"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "Portal Educacional",
  description: "Plataforma para compartilhamento de conteúdo educacional",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <div className="fixed bottom-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <CreatePostModal />
        <EditPostModal />
        <DeletePostDialog />
        <Toaster />
      </body>
    </html>
  )
}



import './globals.css'