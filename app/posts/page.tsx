import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: "Posts | Plataforma Educacional",
  description: "Lista de todos os posts disponíveis na plataforma"
}

// Redireciona imediatamente para a página inicial
export default function PostsPage() {
  redirect('/')
  return null
}