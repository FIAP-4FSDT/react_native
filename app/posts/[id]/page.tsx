'use client'
import { deletePost, fetchPost } from '@/lib/services'
import { Suspense, useEffect, useState, use } from 'react'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  MessageSquare,
  Edit,
  AlertCircle,
  ThumbsUp,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useRouter } from 'next/navigation'

interface PostPageProps {
  params: Promise<{ // <-- params is a Promise that will resolve to an object with id
    id: string;
  }>;
}

function PostContent({ id }: { id: string }) {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadPost = async () => {
      try {
        const postsData = await fetchPost(Number(id));
        const postData = Array.isArray(postsData) ? postsData[0] : postsData;
        setPost(postData);
      } catch (err) {
        console.error("Erro ao carregar post:", err);
        setError("Erro ao carregar post");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  if (loading) {
    return (
      <div className="animate-pulse rounded-lg p-6 border bg-white/80">
        <div className="h-10 bg-gray-200 rounded-md w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded-md w-1/4 mb-6"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6 my-8">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="h-6 w-6" />
          <h2 className="text-xl font-semibold">Erro ao carregar post</h2>
        </div>
        <p>Ocorreu um erro ao tentar carregar o post. Por favor, tente novamente mais tarde.</p>
        <div className="mt-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/posts">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para todos os posts
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6 my-8">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="h-6 w-6" />
          <h2 className="text-xl font-semibold">Post não encontrado</h2>
        </div>
        <p>O post que você procura não existe ou foi removido.</p>
        <div className="mt-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/posts">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para todos os posts
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const createdAt = post.created_at ? new Date(post.created_at) : new Date();

  return (
    <article className="bg-white border border-brand-100 rounded-xl overflow-hidden">
      <div className="p-6 sm:p-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-1">{post.title}</h1>
            {post.author && (
              <p className="text-sm text-muted-foreground">Por: {post.author}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-5 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>
              {formatDistanceToNow(createdAt, { addSuffix: true, locale: ptBR })}
            </span>
          </div>
        </div>

        <div className="prose prose-primary max-w-none pb-4">
          <p>{post.content}</p>
        </div>
      </div>
    </article>
  );
}
export default function PostPage({ params: paramsPromise }: PostPageProps) {
  const params = use(paramsPromise);
  const { id } = params;
  
  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/posts">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para posts
          </Link>
        </Button>
      </div>

      <Suspense fallback={
        <div className="animate-pulse rounded-lg p-6 border bg-white/80">
          <div className="h-10 bg-gray-200 rounded-md w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded-md w-1/4 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded-md w-full"></div>
            <div className="h-4 bg-gray-200 rounded-md w-full"></div>
            <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded-md w-full"></div>
            <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
          </div>
        </div>
      }>
        <PostContent id={id} />
      </Suspense>
    </div>
  )
}