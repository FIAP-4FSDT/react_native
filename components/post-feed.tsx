"use client"

import { useEffect, useState, useRef } from "react"
import { PostCard } from "@/components/post-card"
import { Loader2 } from "lucide-react"
import { SubjectFilter } from "@/components/subject-filter"
import { Button } from "@/components/ui/button"
import { useSearchParams, useRouter } from "next/navigation"
import { fetchPosts, Post } from "@/lib/services"

export function PostFeed({ initialPosts }: { initialPosts: any[] }) {
  const [posts, setPosts] = useState<any[]>(initialPosts)
  const [filteredPosts, setFilteredPosts] = useState<any[]>(initialPosts)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const loaderRef = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(1)
  const POSTS_PER_PAGE = 5

  const searchParams = useSearchParams()
  const router = useRouter()

  // Check if there's a subject query parameter
  useEffect(() => {
    const subjectParam = searchParams.get("subject")
    if (subjectParam) {
      const subjects = subjectParam.split(",")
      setSelectedSubjects(subjects)
    }
  }, [searchParams])

  // Extrair todas as matérias únicas dos posts
  const allSubjects = Array.from(new Set(posts.map((post) => post.subject).filter(Boolean) as string[]))

  const loadMorePosts = async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const nextPage = page + 1
      
      // Usando o novo serviço de API
      const newPosts = await fetchPosts()
      
      // Simular paginação no cliente (já que a API retorna todos os posts)
      const startIndex = page * POSTS_PER_PAGE
      const endIndex = startIndex + POSTS_PER_PAGE
      const paginatedPosts = newPosts.slice(startIndex, endIndex)

      // Simular um pequeno atraso para melhorar a UX
      await new Promise((resolve) => setTimeout(resolve, 300))

      if (paginatedPosts.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...paginatedPosts])
      }

      setHasMore(endIndex < newPosts.length)
      setPage(nextPage)
    } catch (error) {
      console.error("Erro ao carregar mais posts:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar posts quando a seleção de matérias mudar
  useEffect(() => {
    if (selectedSubjects.length === 0) {
      setFilteredPosts(posts)
    } else {
      setFilteredPosts(posts.filter((post) => post.subject && selectedSubjects.includes(post.subject)))

      // Update URL with selected subjects
      const newParams = new URLSearchParams(searchParams.toString())
      if (selectedSubjects.length > 0) {
        newParams.set("subject", selectedSubjects.join(","))
      } else {
        newParams.delete("subject")
      }

      // Update the URL without refreshing the page
      router.push(`/?${newParams.toString()}`, { scroll: false })
    }
  }, [selectedSubjects, posts, searchParams, router])

  // Configurar o Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && hasMore && !loading) {
          loadMorePosts()
        }
      },
      { threshold: 0.1 },
    )

    const currentLoaderRef = loaderRef.current
    if (currentLoaderRef) {
      observer.observe(currentLoaderRef)
    }

    return () => {
      if (currentLoaderRef) {
        observer.unobserve(currentLoaderRef)
      }
    }
  }, [hasMore, loading])

  const handleFilterChange = (subjects: string[]) => {
    setSelectedSubjects(subjects)
  }

  const clearAllFilters = () => {
    setSelectedSubjects([])
    // Remove subject parameter from URL
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.delete("subject")
    router.push("/", { scroll: false })
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-primary/90 animate-fade-in">Postagens Recentes</h2>
        {selectedSubjects.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="flex items-center gap-1 border-brand-200 hover:bg-brand-50"
          >
            <span>Limpar filtros</span>
          </Button>
        )}
      </div>

      <SubjectFilter
        subjects={allSubjects}
        onFilterChange={handleFilterChange}
        initialSelectedSubjects={selectedSubjects}
      />

      <div className="flex flex-col gap-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => (
            <div key={post.id} className="animate-fade-in" style={{ animationDelay: `${Math.min(index * 0.1, 0.5)}s` }}>
              <PostCard post={post} />
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-white/90 backdrop-blur-sm rounded-xl border border-brand-100">
            <p className="text-muted-foreground mb-4">
              {selectedSubjects.length > 0
                ? "Nenhum post encontrado com os filtros selecionados"
                : "Nenhum post disponível"}
            </p>
            {selectedSubjects.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                Limpar filtros
              </Button>
            )}
          </div>
        )}

        <div ref={loaderRef} className="py-4 flex justify-center items-center">
          {loading && (
            <div className="flex flex-col items-center gap-2 text-primary">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p className="text-sm">Carregando mais posts...</p>
            </div>
          )}

          {!hasMore && posts.length > initialPosts.length && (
            <p className="text-sm text-muted-foreground py-4">Você chegou ao fim dos posts disponíveis</p>
          )}
        </div>
      </div>
    </>
  )
}

