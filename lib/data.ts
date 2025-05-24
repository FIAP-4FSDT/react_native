import { getGravatarUrl } from "./utils"

// Dados dos professores com emails para Gravatar
const teachers = [
  {
    name: "Prof. Ricardo Ferreira",
    email: "ricardo.ferreira@exemplo.edu.br",
    get avatar() {
      return getGravatarUrl(this.email)
    },
  },
  {
    name: "Profa. Carla Mendes",
    email: "carla.mendes@exemplo.edu.br",
    get avatar() {
      return getGravatarUrl(this.email)
    },
  },
  {
    name: "Prof. André Santos",
    email: "andre.santos@exemplo.edu.br",
    get avatar() {
      return getGravatarUrl(this.email)
    },
  },
  {
    name: "Profa. Mariana Costa",
    email: "mariana.costa@exemplo.edu.br",
    get avatar() {
      return getGravatarUrl(this.email)
    },
  },
  {
    name: "Prof. Lucas Oliveira",
    email: "lucas.oliveira@exemplo.edu.br",
    get avatar() {
      return getGravatarUrl(this.email)
    },
  },
  {
    name: "Profa. Juliana Almeida",
    email: "juliana.almeida@exemplo.edu.br",
    get avatar() {
      return getGravatarUrl(this.email)
    },
  },
  {
    name: "Prof. Gabriel Silva",
    email: "gabriel.silva@exemplo.edu.br",
    get avatar() {
      return getGravatarUrl(this.email)
    },
  },
  {
    name: "Profa. Beatriz Lima",
    email: "beatriz.lima@exemplo.edu.br",
    get avatar() {
      return getGravatarUrl(this.email)
    },
  },
  {
    name: "Prof. Rodrigo Martins",
    email: "rodrigo.martins@exemplo.edu.br",
    get avatar() {
      return getGravatarUrl(this.email)
    },
  },
  {
    name: "Profa. Fernanda Souza",
    email: "fernanda.souza@exemplo.edu.br",
    get avatar() {
      return getGravatarUrl(this.email)
    },
  },
]

// Dados dos alunos para comentários
const students = [
  {
    name: "João Silva",
    email: "joao.silva@aluno.exemplo.edu.br",
    get avatar() {
      return getGravatarUrl(this.email)
    },
  },
  {
    name: "Maria Oliveira",
    email: "maria.oliveira@aluno.exemplo.edu.br",
    get avatar() {
      return getGravatarUrl(this.email)
    },
  },
  {
    name: "Pedro Santos",
    email: "pedro.santos@aluno.exemplo.edu.br",
    get avatar() {
      return getGravatarUrl(this.email)
    },
  },
  {
    name: "Ana Costa",
    email: "ana.costa@aluno.exemplo.edu.br",
    get avatar() {
      return getGravatarUrl(this.email)
    },
  },
  {
    name: "Lucas Ferreira",
    email: "lucas.ferreira@aluno.exemplo.edu.br",
    get avatar() {
      return getGravatarUrl(this.email)
    },
  },
  {
    name: "Juliana Martins",
    email: "juliana.martins@aluno.exemplo.edu.br",
    get avatar() {
      return getGravatarUrl(this.email)
    },
  },
  {
    name: "Rafael Almeida",
    email: "rafael.almeida@aluno.exemplo.edu.br",
    get avatar() {
      return getGravatarUrl(this.email)
    },
  },
  {
    name: "Camila Lima",
    email: "camila.lima@aluno.exemplo.edu.br",
    get avatar() {
      return getGravatarUrl(this.email)
    },
  },
]

// Simple ID generator for demo purposes
function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Função para gerar comentários aleatórios
const generateComments = (postId: string, count = 2) => {
  const comments = []

  for (let i = 0; i < count; i++) {
    const randomStudent = students[Math.floor(Math.random() * students.length)]
    const randomDaysAgo = Math.floor(Math.random() * 7) + 1
    const randomHoursAgo = Math.floor(Math.random() * 24)
    const randomLikes = Math.floor(Math.random() * 10)

    const commentId = `${postId}-comment-${i + 1}`

    // Gerar respostas para alguns comentários
    const replies = []
    const hasReplies = Math.random() > 0.5

    if (hasReplies) {
      const replyCount = Math.floor(Math.random() * 3) + 1

      for (let j = 0; j < replyCount; j++) {
        const replyStudent = students[Math.floor(Math.random() * students.length)]
        const replyTeacher = Math.random() > 0.7 ? teachers[Math.floor(Math.random() * teachers.length)] : null
        const replyAuthor = replyTeacher || replyStudent
        const replyDaysAgo = Math.floor(Math.random() * randomDaysAgo)
        const replyHoursAgo = Math.floor(Math.random() * randomHoursAgo)
        const replyLikes = Math.floor(Math.random() * 5)

        replies.push({
          id: `${commentId}-reply-${j + 1}`,
          content: getRandomReply(),
          author: {
            name: replyAuthor.name,
            avatar: replyAuthor.avatar,
            email: replyAuthor.email,
            isTeacher: !!replyTeacher,
          },
          createdAt: new Date(Date.now() - replyDaysAgo * 24 * 60 * 60 * 1000 - replyHoursAgo * 60 * 60 * 1000),
          likes: replyLikes,
        })
      }
    }

    comments.push({
      id: commentId,
      content: getRandomComment(),
      author: {
        name: randomStudent.name,
        avatar: randomStudent.avatar,
        email: randomStudent.email,
        isTeacher: false,
      },
      createdAt: new Date(Date.now() - randomDaysAgo * 24 * 60 * 60 * 1000 - randomHoursAgo * 60 * 60 * 1000),
      likes: randomLikes,
      replies: replies,
    })
  }

  // Adicionar um comentário do professor para alguns posts
  if (Math.random() > 0.3) {
    const randomTeacher = teachers[Math.floor(Math.random() * teachers.length)]
    const randomHoursAgo = Math.floor(Math.random() * 48)
    const randomLikes = Math.floor(Math.random() * 15) + 5

    const teacherCommentId = `${postId}-comment-teacher`

    comments.push({
      id: teacherCommentId,
      content: getRandomTeacherComment(),
      author: {
        name: randomTeacher.name,
        avatar: randomTeacher.avatar,
        email: randomTeacher.email,
        isTeacher: true,
      },
      createdAt: new Date(Date.now() - randomHoursAgo * 60 * 60 * 1000),
      likes: randomLikes,
      replies: [],
    })
  }

  return comments
}

// Comentários aleatórios
function getRandomComment() {
  const comments = [
    "Muito interessante essa aula! Consegui entender melhor o conteúdo.",
    "Professor, poderia explicar melhor a parte sobre o tópico principal? Fiquei com algumas dúvidas.",
    "Gostei muito da forma como o conteúdo foi apresentado. Muito didático!",
    "Essa matéria é realmente fascinante. Estou ansioso pela próxima aula.",
    "Tive dificuldade em entender alguns conceitos. Será que podemos revisar na próxima aula?",
    "As referências bibliográficas foram muito úteis para aprofundar o estudo.",
    "Consegui aplicar esse conhecimento no meu projeto de pesquisa. Muito obrigado!",
    "Essa aula abriu minha mente para novas possibilidades de estudo.",
    "Estou impressionado com a relevância desse conteúdo para o mercado de trabalho atual.",
    "Quais seriam as aplicações práticas desse conhecimento no dia a dia?",
  ]

  return comments[Math.floor(Math.random() * comments.length)]
}

// Respostas aleatórias
function getRandomReply() {
  const replies = [
    "Concordo totalmente com você!",
    "Também tive essa dúvida, mas consegui entender depois de rever a aula.",
    "Acho que o ponto principal é entender a relação entre os conceitos apresentados.",
    "Você poderia compartilhar suas anotações sobre esse tópico?",
    "O professor explicou isso muito bem, tente rever a parte inicial da aula.",
    "Vamos formar um grupo de estudos para discutir esse tema?",
    "Encontrei um artigo interessante sobre isso, posso compartilhar com vocês.",
    "Essa é uma excelente observação!",
    "Na verdade, acho que há diferentes perspectivas sobre esse assunto.",
    "Obrigado por compartilhar sua visão, me ajudou a entender melhor.",
  ]

  return replies[Math.floor(Math.random() * replies.length)]
}

// Comentários de professores
function getRandomTeacherComment() {
  const teacherComments = [
    "Obrigado pelos comentários! Fico feliz em ver o engajamento da turma com o conteúdo.",
    "Excelente observação! Na próxima aula vamos aprofundar esse tópico específico.",
    "Para quem ficou com dúvidas, disponibilizei material complementar na plataforma.",
    "Vamos discutir essas questões em mais detalhes no próximo encontro. Continuem com as perguntas!",
    "Estou impressionado com o nível das discussões. Vocês estão no caminho certo!",
    "Lembrem-se que este conteúdo será fundamental para compreender os próximos tópicos do curso.",
    "Quem tiver interesse em se aprofundar, recomendo a leitura dos artigos que indiquei nas referências.",
    "Vou organizar um momento para revisão desses conceitos antes da avaliação.",
    "Excelentes reflexões! É esse tipo de pensamento crítico que esperamos desenvolver.",
    "Agradeço o feedback sobre a aula. Estou sempre buscando melhorar o material didático.",
  ]

  return teacherComments[Math.floor(Math.random() * teacherComments.length)]
}

// Generate more mock posts for testing infinite scroll
const generateMorePosts = () => {
  const subjects = [
    "Física",
    "Literatura",
    "Matemática",
    "História",
    "Biologia",
    "Química",
    "Geografia",
    "Filosofia",
    "Sociologia",
    "Artes",
    "Educação Física",
    "Inglês",
    "Espanhol",
  ]

  const additionalPosts = []

  for (let i = 7; i <= 30; i++) {
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)]
    const randomTeacher = teachers[Math.floor(Math.random() * teachers.length)]
    const randomDaysAgo = Math.floor(Math.random() * 60)
    const randomLikes = Math.floor(Math.random() * 50) + 1
    const postId = i.toString()

    additionalPosts.push({
      id: postId,
      title: `${randomSubject}: Aula ${Math.floor(Math.random() * 10) + 1} - Conceitos Fundamentais`,
      content: `Esta aula aborda os conceitos fundamentais de ${randomSubject}, explorando as principais teorias e aplicações práticas.

Os alunos aprenderão sobre a importância deste tema no contexto atual e como aplicar estes conhecimentos em situações do dia a dia.

Ao final desta aula, espera-se que os estudantes sejam capazes de compreender e analisar criticamente os conceitos apresentados, desenvolvendo habilidades essenciais para seu desenvolvimento acadêmico.`,
      author: {
        name: randomTeacher.name,
        avatar: randomTeacher.avatar,
        email: randomTeacher.email,
      },
      createdAt: new Date(Date.now() - randomDaysAgo * 24 * 60 * 60 * 1000),
      subject: randomSubject,
      likes: randomLikes,
      comments: generateComments(postId, Math.floor(Math.random() * 4) + 1),
    })
  }

  return additionalPosts
}

// Original posts
const originalPosts = [
  {
    id: "1",
    title: "Introdução à Física Quântica",
    content:
      "A física quântica é um ramo da física que lida com fenômenos em escalas atômicas e subatômicas, explicando o comportamento da matéria e suas interações com a energia.\n\nNesta aula, vamos explorar os conceitos fundamentais da mecânica quântica, incluindo a dualidade onda-partícula, o princípio da incerteza de Heisenberg e a superposição quântica.\n\nA compreensão desses conceitos é essencial para entender como o mundo funciona em escalas muito pequenas, onde as leis da física clássica não se aplicam. Vamos também discutir algumas das aplicações práticas da física quântica, como lasers, transistores e computação quântica.",
    author: {
      name: teachers[0].name,
      avatar: teachers[0].avatar,
      email: teachers[0].email,
    },
    createdAt: new Date("2025-03-28T14:30:00"),
    subject: "Física",
    likes: 42,
    comments: generateComments("1", 4),
  },
  {
    id: "2",
    title: "Literatura Brasileira: Modernismo",
    content:
      "O Modernismo brasileiro foi um movimento artístico e literário que teve início com a Semana de Arte Moderna de 1922, em São Paulo.\n\nNesta aula, vamos estudar as principais características do Modernismo brasileiro, seus autores mais importantes e as obras que marcaram esse período. Analisaremos textos de Mário de Andrade, Oswald de Andrade, Manuel Bandeira e outros escritores que revolucionaram a literatura brasileira.\n\nVamos também discutir como o Modernismo refletiu as transformações sociais, políticas e culturais do Brasil no início do século XX, e como esse movimento continua a influenciar a literatura contemporânea.",
    author: {
      name: teachers[1].name,
      avatar: teachers[1].avatar,
      email: teachers[1].email,
    },
    createdAt: new Date("2025-03-27T10:15:00"),
    subject: "Literatura",
    likes: 28,
    comments: generateComments("2", 3),
  },
  // More original posts...
]

// Combine original posts with generated posts
export const posts = [...originalPosts, ...generateMorePosts()]

// Usuário atual simulado (para comentários e autenticação)
export const currentUser = {
  name: "Prof. Ricardo Ferreira",
  email: "ricardo.ferreira@exemplo.edu.br",
  avatar: getGravatarUrl("ricardo.ferreira@exemplo.edu.br"),
  isTeacher: true,
}

