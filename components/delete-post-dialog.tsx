"use client"

import { useState } from "react"
import { AlertTriangle } from "lucide-react"
import { useDeletePostDialog } from "@/hooks/use-delete-post-dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { deletePost } from "@/lib/services"

export function DeletePostDialog() {
  const { isOpen, postId, postTitle, closeDialog } = useDeletePostDialog()
  const router = useRouter()
  const { toast } = useToast()

  const [isDeleting, setIsDeleting] = useState(false)

  if (!isOpen || !postId) return null

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      await deletePost(Number(postId))
      
      toast({
        title: "Post excluído com sucesso!",
        description: "Seu post foi removido permanentemente.",
      })

      // Fechar diálogo
      closeDialog()

      // Redirecionar para página de posts
      router.push('/my-posts')
      router.refresh()
    } catch (error) {
      toast({
        title: "Erro ao excluir post",
        description: "Ocorreu um erro ao excluir seu post. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center gap-3 text-amber-600 mb-4">
            <AlertTriangle className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Confirmar exclusão</h2>
          </div>

          <p className="mb-2">
            Tem certeza que deseja excluir o post <span className="font-medium">"{postTitle}"</span>?
          </p>
          <p className="text-muted-foreground text-sm mb-6">
            Esta ação não pode ser desfeita e o post será removido permanentemente.
          </p>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={closeDialog} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Excluindo..." : "Excluir Post"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

