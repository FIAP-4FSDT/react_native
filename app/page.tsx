import { SearchBar } from "@/components/search-bar"
import { PostFeed } from "@/components/post-feed"
import { fetchPosts } from "@/lib/actions"
import { CreatePostButton } from "@/components/create-post-button"
import { MyPostsButton } from "@/components/my-posts-button"
import { jwtVerify } from "jose"
import { cookies } from 'next/headers'

export default async function Home() {
  const { posts: initialPosts } = await fetchPosts(1, 50)
  const accessToken = (await cookies()).get('accessToken')!
  const { payload } = await jwtVerify(accessToken.value, new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!))
  const decoded = payload as { userId: number }
  const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${decoded.userId}`, {
    method: 'GET',
    headers: {
      'accessToken': `${accessToken.value}`
    }
  })
  const userData = await userResponse.json()
  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <header className="mb-8 animate-fade-in sticky top-0 z-10 bg-background/90 backdrop-blur-md py-4 -mx-4 px-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-primary">Portal Educacional</h1>
            <div className="flex items-center gap-3">
              {userData.tipo_usuario === 'professor' && (
                <MyPostsButton 
                  className="transition-all hover:shadow-md hover:bg-secondary/80 px-4" 
                  size="sm"
                  variant="outline"
                />
              )}
              {userData.tipo_usuario === 'professor' && (
                <CreatePostButton 
                  className="transition-all hover:shadow-md hover:bg-primary/90 px-4" 
                  variant="default"
                  size="sm"
                />
              )}
            </div>
          </div>
          <div className="w-full">
            <SearchBar />
          </div>
        </header>

        <main>
          <PostFeed initialPosts={initialPosts} />
        </main>
      </div>
    </div>
  )
}

