"use client" // Adicione se este componente tiver interatividade ou hooks

import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { useState } from 'react' // Exemplo se usar estado

interface DeletePostButtonProps {
  postId: number // Pode não ser necessário se onDelete já tem o ID encapsulado
  onDelete: () => Promise<void> // Ou apenas () => void
}

export function DeletePostButton({ onDelete }: DeletePostButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (confirm("Tem certeza que deseja excluir este post?")) {
      setIsLoading(true);
      try {
        await onDelete();
      } catch (error) {
        // O erro já é tratado no wrapper, mas pode adicionar algo aqui se necessário
        console.error("Erro no botão de deletar:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Button variant="outline" size="icon" onClick={handleClick} disabled={isLoading}>
      {isLoading ? "..." : <Trash2 className="h-4 w-4" />}
      <span className="sr-only">Deletar post</span>
    </Button>
  )
}