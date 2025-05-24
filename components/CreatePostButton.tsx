import { Button } from "./ui/button";
import { Plus } from "lucide-react";

export function CreatePostButton({ onCreate }: { onCreate: () => Promise<void> } ) {
  return (
    <Button onClick={async () => await onCreate()}>
      <Plus className="h-4 w-4 mr-2" />
        Criar Post
    </Button>
  )
}
