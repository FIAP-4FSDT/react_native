'use server'

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  const protectedRoutes = ['/search', '/my-posts', '/']
  const isPostRoute = request.nextUrl.pathname.startsWith('/posts')
  if (protectedRoutes.includes(request.nextUrl.pathname) || isPostRoute) {
    console.log('middleware')
    const accessToken = (await cookies()).get('accessToken')
    if (!accessToken) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
    try {
      const { payload } = await jwtVerify(accessToken.value, new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!))
      const decoded = payload as { userId: number }
      if (request.nextUrl.pathname === '/my-posts') {
        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${decoded.userId}`, {
          method: 'GET',
          headers: {
            'accessToken': `${accessToken.value}`
          }
        })
        const userData = await userResponse.json()
        if (userData.tipo_usuario === 'aluno') {
          return NextResponse.redirect(new URL('/unauthorized', request.url))
        }
        
        // Se for professor, adiciona userId aos headers
        const response = NextResponse.next()
        response.headers.set('x-user-id', decoded.userId.toString())
        return response
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }
  
  return NextResponse.next()
}