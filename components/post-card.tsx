import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { formatDate, getSubjectColors } from "@/lib/utils"
import { LikeButton } from "@/components/like-button"

interface Post {
  id: string
  title: string
  content: string
  nome: string
  createdAt: Date
  subject?: string
  likes?: number
}

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  console.log(post)
  // Obter cores específicas para a matéria
  const subjectColors = post.subject
    ? getSubjectColors(post.subject)
    : {
        bg: "bg-gray-100",
        text: "text-gray-700",
        border: "border-gray-200",
      }
  return (
    <Link href={`/posts/${post.id}`}>
      <Card
        className={`w-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-brand-100 bg-white/90 backdrop-blur-sm ${post.subject ? subjectColors.border : ""}`}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-brand-200">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {post.nome.charAt(0) ?? ''}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{post.nome}</p>
              <p className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
            </div>
            {post.subject && (
              <div className={`ml-auto text-xs px-2.5 py-0.5 rounded-full ${subjectColors.bg} ${subjectColors.text}`}>
                {post.subject}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="text-xl font-semibold mb-2 text-primary">{post.title}</h3>
          <p className="text-muted-foreground line-clamp-3">{post.content}</p>
        </CardContent>
        <CardFooter className="pt-0 flex justify-between items-center">
          <LikeButton postId={post.id} initialLikes={post.likes || 0} size="sm" />
        </CardFooter>
      </Card>
    </Link>
  )
}

