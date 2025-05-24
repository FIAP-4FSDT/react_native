import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
        <h2 className="text-xl font-semibold mb-4">Acesso Restrito</h2>
        <p className="text-muted-foreground mb-4">
          Você precisa estar logado para acessar esta página. Faça login para obter acesso...
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Ir para Login
        </Link>
      </div>
    </div>
  )
}
