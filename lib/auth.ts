"use server"

import { cookies } from "next/headers"
import { jwtVerify, JWTPayload } from "jose"

// Tipo da resposta do usuário
export interface UserResponse {
  id: number
  nome: string
  email: string
  tipo: "professor" | "aluno" | "admin"
  avatar?: string
}

// Interface para os dados decodificados do token
interface DecodedToken extends JWTPayload {
  userId: number
  exp: number
}

/**
 * Verifica se o token atual é válido
 * @returns boolean indicando se o token é válido
 */
export async function isTokenValid(): Promise<boolean> {
  try {
    const accessToken = (await cookies()).get("accessToken")
    
    if (!accessToken) {
      return false
    }

    // Verifica se o token é válido
    const { payload } = await jwtVerify(
      accessToken.value, 
      new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!)
    )
    
    const decoded = payload as DecodedToken
    
    // Verifica se o token expirou
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return false
    }
    
    return true
  } catch (error) {
    console.error("Erro ao verificar token:", error)
    return false
  }
}

/**
 * Obtém o token de acesso dos cookies
 * @returns token de acesso ou null se não existir
 */
export async function getAccessToken(): Promise<string | null> {
  const accessToken = (await cookies()).get("accessToken")
  return accessToken ? accessToken.value : null
}

/**
 * Obtém o userId do token decodificado
 * @returns userId ou null em caso de erro
 */
export async function getUserIdFromToken(): Promise<number | null> {
  try {
    const accessToken = await getAccessToken()
    
    if (!accessToken) {
      return null
    }

    const { payload } = await jwtVerify(
      accessToken, 
      new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!)
    )
    
    const decoded = payload as DecodedToken
    return decoded.userId
  } catch (error) {
    console.error("Erro ao decodificar token:", error)
    return null
  }
}

/**
 * Busca os dados do usuário usando o accessToken
 * @returns Dados do usuário ou null em caso de erro
 */
export async function fetchUserData(): Promise<UserResponse | null> {
  try {
    const userId = await getUserIdFromToken()
    
    if (!userId) {
      return null
    }
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
    const response = await fetch(`${apiUrl}/usuarios/${userId}`, {
      headers: {
        Authorization: `Bearer ${await getAccessToken()}`,
      },
      cache: "no-store",
    })
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar usuário: ${response.status}`)
    }
    
    const userData: UserResponse = await response.json()
    return userData
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error)
    return null
  }
}

/**
 * Verifica se o usuário é um professor
 * @returns boolean indicando se o usuário é professor
 */
export async function isTeacher(): Promise<boolean> {
  try {
    const userData = await fetchUserData()
    return userData?.tipo === "professor"
  } catch (error) {
    return false
  }
}

/**
 * Verifica se o usuário é um aluno
 * @returns boolean indicando se o usuário é aluno
 */
export async function isStudent(): Promise<boolean> {
  try {
    const userData = await fetchUserData()
    return userData?.tipo === "aluno"
  } catch (error) {
    return false
  }
}

/**
 * Verifica se o usuário é um administrador
 * @returns boolean indicando se o usuário é admin
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const userData = await fetchUserData()
    return userData?.tipo === "admin"
  } catch (error) {
    return false
  }
}