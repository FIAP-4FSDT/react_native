import { NextRequest, NextResponse } from 'next/server'
import { getAccessToken } from '@/lib/auth'

// URL base da API do backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Handler para requisições GET (listar posts)
export async function GET(request: NextRequest) {
  try {
    // Obter parâmetros da URL
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const search = searchParams.get('search')
    
    // Construir URL para o backend
    let url = `${API_BASE_URL}/posts`
    const params = new URLSearchParams()
    
    if (id) params.append('id', id)
    if (search) params.append('search', search)
    
    if (params.toString()) {
      url += `?${params.toString()}`
    }
    
    // Obter token de acesso
    const token = await getAccessToken() 
    // Fazer requisição para o backend
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'accessToken': token!
      }
    })
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar posts: ${response.status}`)
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro na API de posts:', error)
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' },
      { status: 500 }
    )
  }
}

// Handler para requisições POST (criar post)
export async function POST(request: NextRequest) {
  try {
    // Obter dados do corpo da requisição
    const postData = await request.json()
    
    // Obter token de acesso
    const token = await getAccessToken()
    
    // Fazer requisição para o backend
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accessToken': token || ''
      },
      body: JSON.stringify(postData)
    })
    
    if (!response.ok) {
      throw new Error(`Erro ao criar post: ${response.status}`)
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro na API de posts:', error)
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' },
      { status: 500 }
    )
  }
} 