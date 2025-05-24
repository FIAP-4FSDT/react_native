"use server"

import { currentUser } from "./data"
import { createPasswordResetToken, validatePasswordResetToken, removePasswordResetToken } from "./password-reset"
import { sendEmail, generatePasswordResetEmail } from "./email"
import { getAccessToken } from "./auth"

function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export async function fetchPosts(page: number, limit: number) {
  const token = await getAccessToken()
  const data = await fetch(process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/posts` : 'http://localhost:3001/api/posts', { 
    method: 'GET',
    headers: {
      'accessToken': token || ''
    }
  })
  const allPosts = await data.json()
  const start = (page - 1) * limit
  const end = start + limit
  const posts = allPosts.slice(start, end)

  return {
    posts,
    hasMore: end < allPosts.length,
  }
}

export async function fetchUserPosts(userEmail: string) {
  // Simulate server delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  const { posts } = await fetchPosts(1, 10)
  const userPosts = posts.filter((post: { author: { email: string } }) => post.author.email === userEmail)
  return userPosts
}

export async function likePost(postId: string) {
  // Simulate server delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  const { posts } = await fetchPosts(1, 10)
  // Encontrar o post
  const postIndex = posts.findIndex((p: any) => p.id === postId)

  if (postIndex !== -1) {
    // Incrementar curtidas
    posts[postIndex].likes = (posts[postIndex].likes || 0) + 1
    return { success: true, likes: posts[postIndex].likes }
  }

  return { success: false }
}

export async function unlikePost(postId: string) {
  // Simulate server delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Encontrar o post
  const { posts } = await fetchPosts(1, 10)
  const postIndex = posts.findIndex((p: any) => p.id === postId)

  if (postIndex !== -1 && (posts[postIndex].likes || 0) > 0) {
    // Decrementar curtidas
    posts[postIndex].likes = (posts[postIndex].likes || 0) - 1
    return { success: true, likes: posts[postIndex].likes }
  }

  return { success: false }
}

export async function createPost(data: {
  title: string
  content: string
  subject: string
}) {
  // Simulate server delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    const newPostId = generateId()

    const newPost = {
      id: newPostId,
      title: data.title,
      content: data.content,
      author: {
        name: currentUser.name,
        avatar: currentUser.avatar,
        email: currentUser.email,
      },
      createdAt: new Date(),
      subject: data.subject,
      likes: 0,
      comments: [],
    }

    // Em um app real, isso seria salvo no banco de dados
    // Aqui, apenas adicionamos ao array de posts em memória
    const { posts } = await fetchPosts(1, 10)
    posts.unshift(newPost)

    return {
      success: true,
      postId: newPostId,
    }
  } catch (error) {
    console.error("Error creating post:", error)
    return {
      success: false,
      error: "Failed to create post",
    }
  }
}

export async function updatePost(data: {
  id: string
  title: string
  content: string
  subject: string
}) {
  // Simulate server delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  try {
    // Encontrar o post
    const { posts } = await fetchPosts(1, 10)
    const postIndex = posts.findIndex((p: any) => p.id === data.id)

    if (postIndex === -1) {
      return {
        success: false,
        error: "Post not found",
      }
    }

    // Verificar se o usuário atual é o autor do post
    if (posts[postIndex].author.email !== currentUser.email) {
      return {
        success: false,
        error: "Unauthorized",
      }
    }

    // Atualizar o post
    posts[postIndex] = {
      ...posts[postIndex],
      title: data.title,
      content: data.content,
      subject: data.subject,
      // Adicionar um campo updatedAt em um app real
    }

    return {
      success: true,
      postId: data.id,
    }
  } catch (error) {
    console.error("Error updating post:", error)
    return {
      success: false,
      error: "Failed to update post",
    }
  }
}

export async function deletePost(postId: string) {
  // Simulate server delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  try {
    // Encontrar o post
    const { posts } = await fetchPosts(1, 10)
    const postIndex = posts.findIndex((p: any) => p.id === postId)

    if (postIndex === -1) {
      return {
        success: false,
        error: "Post not found",
      }
    }

    // Verificar se o usuário atual é o autor do post
    if (posts[postIndex].author.email !== currentUser.email) {
      return {
        success: false,
        error: "Unauthorized",
      }
    }

    // Remover o post
    posts.splice(postIndex, 1)

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error deleting post:", error)
    return {
      success: false,
      error: "Failed to delete post",
    }
  }
}

const users = [
  { email: "ricardo.ferreira@exemplo.edu.br", name: "Prof. Ricardo Ferreira" },
  { email: "carla.mendes@exemplo.edu.br", name: "Profa. Carla Mendes" },
  { email: "andre.santos@exemplo.edu.br", name: "Prof. André Santos" },
  { email: "maria.oliveira@aluno.exemplo.edu.br", name: "Maria Oliveira" },
  { email: "joao.silva@aluno.exemplo.edu.br", name: "João Silva" },
]

export async function requestPasswordReset(email: string) {
  // Simulate server delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    // Check if the email exists in our system
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

    if (!user) {
      // For security reasons, we don't want to reveal if an email exists or not
      // So we'll return success even if the email doesn't exist
      return { success: true }
    }

    // Generate a reset token
    const resetToken = createPasswordResetToken(email)

    // Generate the email content
    const { subject, html } = generatePasswordResetEmail({
      email,
      resetToken,
    })

    // Send the email
    const emailResult = await sendEmail({
      to: email,
      subject,
      html,
    })

    if (!emailResult.success) {
      return {
        success: false,
        error: emailResult.error || "Failed to send email",
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error requesting password reset:", error)
    return {
      success: false,
      error: "Failed to process password reset request",
    }
  }
}

export async function resetPassword({
  email,
  token,
  newPassword,
}: {
  email: string
  token: string
  newPassword: string
}) {
  // Simulate server delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    // Validate the token
    const isValid = validatePasswordResetToken(email, token)

    if (!isValid) {
      return {
        success: false,
        error: "Invalid or expired reset token",
      }
    }

    // Check if the user exists
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

    if (!user) {
      return {
        success: false,
        error: "User not found",
      }
    }

    // In a real app, you would hash the password and update it in the database
    console.log(`Password for ${email} has been reset to: [REDACTED]`)

    // Remove the used token
    removePasswordResetToken(email, token)

    return { success: true }
  } catch (error) {
    console.error("Error resetting password:", error)
    return {
      success: false,
      error: "Failed to reset password",
    }
  }
}

