# 📘 Projeto Front-End - Next.js

Este projeto é um front-end desenvolvido com **Next.js**, **React**, **TypeScript** e **Tailwind CSS**, integrado a uma API backend em Node.js com SQLite. Ele foi criado para facilitar a comunicação entre professores(as) e alunos(as) por meio de postagens educacionais.

## 🚀 Como Rodar o Projeto

### 1. Instalar Dependências

Usando o `pnpm`:

```bash
pnpm install
```

> Caso não tenha o `pnpm` instalado:

```bash
npm install -g pnpm
```

### 2. Rodar o Servidor de Desenvolvimento

```bash
pnpm dev
```

A aplicação estará disponível em:

```
http://localhost:3000
```

---

## 🧩 Como Usar o Projeto

### 👨‍🏫 Para Professores(as)

- **Acessar Área Administrativa:** Clique no botão correspondente na página inicial.
- **Criar Postagem:** Preencha "Título" e "Conteúdo" e clique em **Salvar**.
- **Editar Postagem:** Clique em **Editar**, faça as alterações e clique em **Atualizar**.
- **Excluir Postagem:** Clique no ícone de lixeira e confirme.
- **Listar Postagens:** Navegue e utilize filtros por título ou data.

### 👩‍🎓 Para Alunos(as)

- **Visualizar Postagens:** Acesse a página inicial.
- **Ler Conteúdo:** Clique no título ou em **Ler mais** para o conteúdo completo.

---

## 🗂️ Estrutura Básica

```
/app
/components        → Componentes reutilizáveis
/hooks             → Hooks customizados
/lib               → Funções utilitárias
/public            → Arquivos estáticos
/styles            → Estilos com Tailwind
```

---

## 📦 Tecnologias Utilizadas

- Next.js
- React
- TypeScript
- Tailwind CSS
- pnpm (gerenciador de pacotes)
