import crypto from "crypto"

// In a real application, these tokens would be stored in a database
// This is a simplified in-memory implementation for demonstration purposes
interface PasswordResetToken {
  email: string
  token: string
  expires: Date
}

// In-memory storage for password reset tokens
const passwordResetTokens: PasswordResetToken[] = []

/**
 * Generate a secure random token for password reset
 * @returns A secure random token
 */
export function generateResetToken(): string {
  // Generate a random 32-byte hex string
  return crypto.randomBytes(32).toString("hex")
}

/**
 * Create a password reset token for a user
 * @param email The user's email address
 * @returns The generated token
 */
export function createPasswordResetToken(email: string): string {
  // Remove any existing tokens for this email
  const existingTokenIndex = passwordResetTokens.findIndex((t) => t.email.toLowerCase() === email.toLowerCase())

  if (existingTokenIndex !== -1) {
    passwordResetTokens.splice(existingTokenIndex, 1)
  }

  // Generate a new token
  const token = generateResetToken()

  // Set expiration to 1 hour from now
  const expires = new Date()
  expires.setHours(expires.getHours() + 1)

  // Store the token
  passwordResetTokens.push({
    email: email.toLowerCase(),
    token,
    expires,
  })

  return token
}

/**
 * Validate a password reset token
 * @param email The user's email address
 * @param token The token to validate
 * @returns True if the token is valid, false otherwise
 */
export function validatePasswordResetToken(email: string, token: string): boolean {
  const now = new Date()

  // Find the token
  const tokenRecord = passwordResetTokens.find(
    (t) => t.email.toLowerCase() === email.toLowerCase() && t.token === token && t.expires > now,
  )

  return !!tokenRecord
}

/**
 * Remove a password reset token after it has been used
 * @param email The user's email address
 * @param token The token to remove
 */
export function removePasswordResetToken(email: string, token: string): void {
  const tokenIndex = passwordResetTokens.findIndex(
    (t) => t.email.toLowerCase() === email.toLowerCase() && t.token === token,
  )

  if (tokenIndex !== -1) {
    passwordResetTokens.splice(tokenIndex, 1)
  }
}

