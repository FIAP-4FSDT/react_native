'use client' // Essencial para componentes com hooks como useState, useEffect

import { useEffect, useState } from 'react'
import { deletePost, fetchPosts } from '@/lib/services' // Esta função PODE precisar ser ajustada
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlusCircle, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface MyPostsListProps {
  userId: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  author_id: number;
}

export default function MyPostsList({ userId }: MyPostsListProps) {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!userId) {
      setError(true)
      setLoading(false)
      console.error("MyPostsList: userId não fornecido.")
      return
    }

    const fetchData = async () => {
      setLoading(true)
      setError(false)
      try {
        // Idealmente, fetchPosts deveria aceitar userId para buscar apenas os posts relevantes:
        // const userPosts = await fetchPosts({ userId });
        // Se fetchPosts busca todos os posts, você precisa filtrar:
        const allPosts = await fetchPosts() // Assumindo que fetchPosts retorna Post[]
        const numericUserId = Number(userId)
        const userPosts = allPosts.filter(post => post.author_id === numericUserId)
        setPosts(userPosts)
      } catch (err) {
        console.error("Erro ao carregar posts:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId]) // Dependência: refaz o fetch se userId mudar

  if (loading) {
    // O Suspense já trata o estado de carregamento inicial,
    // mas este loading é para recarregamentos ou se Suspense não for usado diretamente aqui.
    // Pode retornar null se o Suspense da página pai for suficiente.
    return (
        <div className="flex flex-col gap-3">
            {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse rounded-lg p-6 border bg-white/80">
                <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded-md w-1/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
            </div>
            ))}
        </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 bg-white/90 backdrop-blur-sm rounded-xl border border-brand-100">
        <h2 className="text-xl font-semibold mb-2">Erro ao carregar seus posts</h2>
        <p className="text-muted-foreground mb-4">
          Ocorreu um erro. Por favor, tente novamente mais tarde.
        </p>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 bg-white/90 backdrop-blur-sm rounded-xl border border-brand-100">
        <h2 className="text-xl font-semibold mb-2">Nenhum post encontrado</h2>
        <p className="text-muted-foreground mb-6">
          Você ainda não criou nenhum post. Que tal criar um agora?
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const createdAt = post.created_at ? new Date(post.created_at) : new Date()
        return (
          <Card key={post.id} className="transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex justify-between">
                <Link href={`/posts/${post.id}`} className="hover:text-brand-500 transition-colors">
                  {post.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-muted-foreground text-sm mb-3">
                {formatDistanceToNow(createdAt, { addSuffix: true, locale: ptBR })}
              </p>
              <p className="line-clamp-2">{post.content}</p>
            </CardContent>
            <CardFooter className="border-t border-border pt-3 flex justify-end gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/posts/${post.id}/edit`}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={async () => {
                    await deletePost(post.id)
                    setPosts(posts.filter(p => p.id !== post.id))
                }} // Adicione a lógica de exclusão
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}