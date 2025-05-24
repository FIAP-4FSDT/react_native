import { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createPost } from '@/lib/services'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Novo Post | Plataforma Educacional',
  description: 'Crie um novo post na plataforma educacional'
}

// Define ação do servidor para criar um novo post
async function createAction(formData: FormData): Promise<void> {
  'use server'
  
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  
  if (!title || !content) {
    // Em vez de retornar um objeto de erro, vamos usar uma abordagem diferente
    // para lidar com erros em Server Actions
    throw new Error('Título e conteúdo são obrigatórios');
  }
  
  try {
    const postId = await createPost({ title, content })
    redirect(`/posts/${postId}`)
  } catch (error) {
    console.error('Erro ao criar post:', error)
    throw new Error('Erro ao criar post. Tente novamente.');
  }
}

export default function NewPostPage() {
  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/posts">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para posts
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Post</CardTitle>
          <CardDescription>
            Compartilhe conhecimento, dúvidas ou reflexões com a comunidade.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input 
                id="title" 
                name="title" 
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
                placeholder="Digite o conteúdo do seu post aqui..." 
                required 
                minLength={20}
                className="min-h-[200px]"
              />
            </div>
            
            <CardFooter className="flex justify-end gap-3 px-0">
              <Button type="button" variant="outline" asChild>
                <Link href="/posts">Cancelar</Link>
              </Button>
              <Button type="submit">Publicar Post</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 