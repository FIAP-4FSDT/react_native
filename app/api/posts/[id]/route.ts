import { NextRequest, NextResponse } from 'next/server'
import { getAccessToken } from '@/lib/auth'

// URL base da API do backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Handler para requisições GET (obter um post específico)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Obter token de acesso
    const token = await getAccessToken()
    
    // Fazer requisição para o backend
    const response = await fetch(`${API_BASE_URL}/posts?id=${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'accessToken': token || ''
      }
    })
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar post: ${response.status}`)
    }
    
    const data = await response.json()
    return NextResponse.json(data[0] || null)
  } catch (error) {
    console.error(`Erro na API de posts/${params.id}:`, error)
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' },
      { status: 500 }
    )
  }
}

// Handler para requisições PUT (atualizar um post)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Obter dados do corpo da requisição
    const postData = await request.json()
    
    // Obter token de acesso
    const token = await getAccessToken()
    
    // Fazer requisição para o backend
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'accessToken': token || ''
      },
      body: JSON.stringify(postData)
    })
    
    if (!response.ok) {
      throw new Error(`Erro ao atualizar post: ${response.status}`)
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Erro na API de posts/${params.id}:`, error)
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' },
      { status: 500 }
    )
  }
}

// Handler para requisições DELETE (excluir um post)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Obter token de acesso
    const token = await getAccessToken()
    
    // Fazer requisição para o backend
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'accessToken': token || ''
      }
    })
    
    if (!response.ok) {
      throw new Error(`Erro ao excluir post: ${response.status}`)
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Erro na API de posts/${params.id}:`, error)
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' },
      { status: 500 }
    )
  }
} 