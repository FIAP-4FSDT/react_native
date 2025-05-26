import { Search, X } from "lucide-react"
import { PostCard } from "@/components/post-card"
import { SearchBar } from "@/components/search-bar"
import { fetchSearchPosts } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface SearchPageProps {
  searchParams: {
    q?: string
  }
}

export const dynamic = 'force-dynamic'

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q?.trim() || ""
  const filteredPosts = query
    ? await fetchSearchPosts(query)
    : []

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <header className="mb-8 animate-fade-in sticky top-0 z-10 bg-background/90 backdrop-blur-md py-4 -mx-4 px-4">
          <h1 className="text-4xl font-bold mb-4 text-primary">Portal Educacional</h1>
          <div className="w-full">
            <SearchBar initialQuery={query} />
          </div>
        </header>

        <main>
          <div className="animate-fade-in flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-primary/90">Resultados da busca</h2>
              <p className="text-muted-foreground">
                {filteredPosts.length} {filteredPosts.length === 1 ? "resultado" : "resultados"} para "{query}"
              </p>
            </div>
            <Button variant="outline" className="flex items-center gap-2 border-brand-200 hover:bg-brand-50" asChild>
              <Link href="/">
                <X className="h-4 w-4" />
                Limpar filtro
              </Link>
            </Button>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${Math.min(index * 0.1, 0.5)}s` }}
                >
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-brand-100 animate-fade-in">
              <Search className="mx-auto h-12 w-12 text-brand-300 mb-4" />
              <h3 className="text-xl font-medium mb-2 text-primary">Nenhum resultado encontrado</h3>
              <p className="text-muted-foreground mb-4">Tente buscar por outro termo ou professor</p>
              <Button asChild variant="outline">
                <Link href="/">
                  <X className="h-4 w-4 mr-2" />
                  Voltar para todos os posts
                </Link>
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

