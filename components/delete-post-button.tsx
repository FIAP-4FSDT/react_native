'use client'

import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";

export function DeletePostButton({ postId, onDelete }: { postId: number, onDelete: () => Promise<void> }) {
  return (
    <Button onClick={async () => {
      await onDelete()
    }} variant="outline" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
