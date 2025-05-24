import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlusCircle, ArrowLeft } from 'lucide-react'
import { CreatePostButton } from '@/components/create-post-button'
import { headers } from 'next/headers' // Importe para ler headers no Server Component
import MyPostsList from '@/components/my-post-list' // Assumindo que MyPostsList está em um arquivo separado

export default async function MyPostsPage() {
  const headersList = await headers()
  const userId = headersList.get('x-user-id') // Lê o header 'x-user-id'

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Home
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-primary">Meus Posts</h1>
        </div>
        <CreatePostButton />
      </div>

      <Suspense fallback={
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse rounded-lg p-6 border bg-white/80">
              <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded-md w-1/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
              <div className="flex justify-end mt-4 space-x-3">
                <div className="h-9 bg-gray-200 rounded-md w-24"></div>
                <div className="h-9 bg-gray-200 rounded-md w-24"></div>
              </div>
            </div>
          ))}
        </div>
      }>
        {/* Passa userId como prop para MyPostsList */}
        {userId ? (
          <MyPostsList userId={userId} />
        ) : (
          <div className="text-center py-8 bg-white/90 backdrop-blur-sm rounded-xl border border-brand-100">
            <h2 className="text-xl font-semibold mb-2">Erro de Autenticação</h2>
            <p className="text-muted-foreground mb-4">
              Não foi possível identificar o usuário. Por favor, tente fazer login novamente.
            </p>
          </div>
        )}
      </Suspense>
    </div>
  )
}