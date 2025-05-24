'use client'
import React, { use } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { fetchPost, updatePost } from '@/lib/services'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Suspense } from 'react'

interface EditPostPageProps {
  params: Promise<{ // <-- params is a Promise that will resolve to an object with id
    id: string;
  }>;
}

// Define ação do servidor para atualizar um post existente
async function updateAction(id: number, formData: FormData, onSuccess: () => void): Promise<void> {
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  
  if (!title || !content) {
    throw new Error('Título e conteúdo são obrigatórios');
  }
  
  try {
    await updatePost(id, { title, content })
    onSuccess()
  } catch (error) {
    console.error('Erro ao atualizar post:', error)
    throw new Error('Erro ao atualizar post. Tente novamente.');
  }
}

function EditPostForm({ id }: { id: number }) {
  const router = useRouter()
  const [post, setPost] = React.useState<any>(null)
  
  // Buscar os dados do post existente usando useEffect
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const postData = await fetchPost(id)
        if (!postData) {
          router.push('/posts')
        }
        setPost(postData)
      } catch (error) {
        console.error('Erro ao buscar post:', error)
        router.push('/posts')
      }
    }
    
    fetchData()
  }, [id, router])
  // Criar uma função que pré-preenche o ID para o updateAction
  const handleUpdate = (formData: FormData) => {
    return updateAction(id, formData, () => router.push(`/posts/${id}`))
  }

  if (!post) {
    return null // Ou um loading spinner
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Post</CardTitle>
        <CardDescription>
          Atualize as informações do seu post.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleUpdate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input 
              id="title" 
              name="title" 
              defaultValue={post[0].title}
              placeholder="Digite um título para o post" 
              required 
              minLength={5}
              maxLength={100}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo</Label>
            <Textarea 
              id="content" 
              name="content" 
              defaultValue={post[0].content}
              placeholder="Digite o conteúdo do seu post aqui..." 
              required 
              minLength={20}
              className="min-h-[200px]"
            />
          </div>
          
          <CardFooter className="flex justify-end gap-3 px-0">
            <Button type="button" variant="outline" asChild>
              <Link href={`/posts/${id}`}>Cancelar</Link>
            </Button>
            <Button type="submit">Salvar Alterações</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}

export default function EditPostPage({ params: paramsPromise }: EditPostPageProps) {
  const params = use(paramsPromise);
  const postId = Number(params.id)
  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/posts/${params.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para o post
          </Link>
        </Button>
      </div>
      
      <Suspense fallback={
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded-md w-2/3 mb-8"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded-md w-full"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
            <div className="h-40 bg-gray-200 rounded-md w-full"></div>
          </div>
        </div>
      }>
        <EditPostForm id={postId} />
      </Suspense>
    </div>
  )
} 