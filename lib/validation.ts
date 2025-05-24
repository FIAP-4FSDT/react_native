// Validation utility functions

/**
 * Validates an email address format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates password strength
 * Requirements:
 * - At least 8 characters
 * - Contains at least one uppercase letter
 * - Contains at least one lowercase letter
 * - Contains at least one number
 */
export function isStrongPassword(password: string): boolean {
  if (password.length < 8) return false

  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)

  return hasUppercase && hasLowercase && hasNumber
}

/**
 * Get password strength feedback
 */
export function getPasswordStrengthFeedback(password: string): {
  isStrong: boolean
  feedback: string
} {
  if (!password) {
    return {
      isStrong: false,
      feedback: "A senha é obrigatória",
    }
  }

  if (password.length < 8) {
    return {
      isStrong: false,
      feedback: "A senha deve ter pelo menos 8 caracteres",
    }
  }

  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)

  if (!hasUppercase) {
    return {
      isStrong: false,
      feedback: "A senha deve conter pelo menos uma letra maiúscula",
    }
  }

  if (!hasLowercase) {
    return {
      isStrong: false,
      feedback: "A senha deve conter pelo menos uma letra minúscula",
    }
  }

  if (!hasNumber) {
    return {
      isStrong: false,
      feedback: "A senha deve conter pelo menos um número",
    }
  }

  return {
    isStrong: true,
    feedback: "Senha forte",
  }
}

/**
 * Validates that a field is not empty
 */
export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0
}

/**
 * Validates that two passwords match
 */
export function passwordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword
}

/**
 * Validates a name (no numbers or special characters)
 */
export function isValidName(name: string): boolean {
  return /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(name.trim())
}

