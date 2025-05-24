import Link from "next/link"
import type { Metadata } from "next"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Termos de Serviço | Portal Educacional",
  description: "Termos de Serviço do Portal Educacional",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          asChild
          className="mb-6 text-primary hover:text-primary/80 hover:bg-secondary animate-fade-in"
        >
          <Link href="/" className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-brand-100 p-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-primary mb-6">Termos de Serviço</h1>
          <p className="text-muted-foreground mb-6">Última atualização: {new Date().toLocaleDateString("pt-BR")}</p>

          <div className="prose prose-slate max-w-none">
            <h2>1. Introdução</h2>
            <p>
              Bem-vindo ao Portal Educacional. Estes Termos de Serviço ("Termos") regem seu acesso e uso do Portal
              Educacional, incluindo quaisquer conteúdos, funcionalidades e serviços oferecidos em ou através do portal.
            </p>
            <p>
              Ao acessar ou utilizar nosso Portal, você concorda em ficar vinculado a estes Termos. Se você não
              concordar com qualquer parte destes Termos, você não terá permissão para acessar o Portal.
            </p>

            <h2>2. Definições</h2>
            <p>
              <strong>"Portal"</strong> refere-se ao Portal Educacional.
            </p>
            <p>
              <strong>"Usuário"</strong> refere-se a qualquer indivíduo que acesse ou utilize o Portal, incluindo
              professores, estudantes e responsáveis.
            </p>
            <p>
              <strong>"Conteúdo"</strong> refere-se a textos, gráficos, imagens, vídeos, áudios, dados e outros
              materiais que podem ser visualizados ou acessados através do Portal.
            </p>

            <h2>3. Elegibilidade e Contas</h2>
            <p>
              Para utilizar certas funcionalidades do Portal, você precisará criar uma conta. Você é responsável por
              manter a confidencialidade de suas credenciais de login e por todas as atividades que ocorrerem sob sua
              conta.
            </p>
            <p>
              Você concorda em fornecer informações precisas, atuais e completas durante o processo de registro e em
              atualizar tais informações para mantê-las precisas, atuais e completas.
            </p>
            <p>
              Você não deve criar contas usando identidades falsas ou informações imprecisas, ou em nome de outra pessoa
              sem autorização.
            </p>

            <h2>4. Uso Aceitável</h2>
            <p>
              Você concorda em usar o Portal apenas para fins legais e de acordo com estes Termos. Você concorda em não
              usar o Portal:
            </p>
            <ul>
              <li>De qualquer maneira que viole qualquer lei ou regulamento aplicável.</li>
              <li>Para transmitir ou procurar enviar qualquer material publicitário ou promocional não solicitado.</li>
              <li>
                Para personificar ou tentar personificar o Portal, um funcionário do Portal, outro usuário ou qualquer
                outra pessoa.
              </li>
              <li>
                De qualquer maneira que possa desativar, sobrecarregar, danificar ou prejudicar o Portal ou interferir
                no uso do Portal por qualquer outra parte.
              </li>
              <li>
                Para acessar, adulterar ou usar áreas não públicas do Portal, sistemas de computador do Portal ou
                sistemas técnicos de entrega de provedores do Portal.
              </li>
              <li>
                Para tentar sondar, escanear ou testar a vulnerabilidade de qualquer sistema ou rede do Portal ou violar
                quaisquer medidas de segurança ou autenticação.
              </li>
            </ul>

            <h2>5. Conteúdo do Usuário</h2>
            <p>
              Nosso Portal permite que você poste, vincule, armazene, compartilhe e disponibilize certas informações,
              textos, gráficos, vídeos ou outros materiais ("Conteúdo do Usuário").
            </p>
            <p>
              Você é responsável pelo Conteúdo do Usuário que você postar no Portal, incluindo sua legalidade,
              confiabilidade e adequação.
            </p>
            <p>
              Ao postar Conteúdo do Usuário no Portal, você concede ao Portal o direito e a licença para usar,
              modificar, executar publicamente, exibir publicamente, reproduzir e distribuir tal Conteúdo do Usuário no
              e através do Portal.
            </p>
            <p>
              Você declara e garante que: (i) o Conteúdo do Usuário é seu ou você tem o direito de usá-lo e conceder os
              direitos e licenças conforme previsto nestes Termos, e (ii) a postagem de seu Conteúdo do Usuário no
              Portal não viola os direitos de privacidade, direitos de publicidade, direitos autorais, direitos
              contratuais ou quaisquer outros direitos de qualquer pessoa.
            </p>

            <h2>6. Propriedade Intelectual</h2>
            <p>
              O Portal e seu conteúdo original, recursos e funcionalidades são e permanecerão propriedade exclusiva do
              Portal Educacional e seus licenciadores.
            </p>
            <p>
              O Portal é protegido por direitos autorais, marcas registradas e outras leis do Brasil e de outros países.
              Nossas marcas registradas e identidade visual não podem ser usadas em conexão com qualquer produto ou
              serviço sem o consentimento prévio por escrito do Portal Educacional.
            </p>

            <h2>7. Links para Outros Sites</h2>
            <p>
              Nosso Portal pode conter links para sites ou serviços de terceiros que não são de propriedade ou
              controlados pelo Portal Educacional.
            </p>
            <p>
              O Portal Educacional não tem controle sobre, e não assume nenhuma responsabilidade pelo conteúdo,
              políticas de privacidade ou práticas de quaisquer sites ou serviços de terceiros. Você reconhece e
              concorda que o Portal Educacional não será responsável, direta ou indiretamente, por qualquer dano ou
              perda causada ou alegadamente causada por ou em conexão com o uso ou confiança em qualquer conteúdo, bens
              ou serviços disponíveis em ou através de tais sites ou serviços.
            </p>

            <h2>8. Rescisão</h2>
            <p>
              Podemos encerrar ou suspender sua conta e acesso ao Portal imediatamente, sem aviso prévio ou
              responsabilidade, por qualquer motivo, incluindo, sem limitação, se você violar estes Termos.
            </p>
            <p>
              Após a rescisão, seu direito de usar o Portal cessará imediatamente. Se você deseja encerrar sua conta,
              você pode simplesmente descontinuar o uso do Portal.
            </p>

            <h2>9. Limitação de Responsabilidade</h2>
            <p>
              Em nenhum caso o Portal Educacional, seus diretores, funcionários, parceiros, agentes, fornecedores ou
              afiliados serão responsáveis por quaisquer danos indiretos, incidentais, especiais, consequenciais ou
              punitivos, incluindo, sem limitação, perda de lucros, dados, uso, boa vontade ou outras perdas
              intangíveis, resultantes de (i) seu acesso ou uso ou incapacidade de acessar ou usar o Portal; (ii)
              qualquer conduta ou conteúdo de terceiros no Portal; (iii) qualquer conteúdo obtido do Portal; e (iv)
              acesso não autorizado, uso ou alteração de suas transmissões ou conteúdo, seja com base em garantia,
              contrato, ato ilícito (incluindo negligência) ou qualquer outra teoria legal, independentemente de termos
              sido avisados da possibilidade de tais danos.
            </p>

            <h2>10. Isenção de Garantias</h2>
            <p>
              Seu uso do Portal é por sua conta e risco. O Portal é fornecido "como está" e "conforme disponível". O
              Portal é fornecido sem garantias de qualquer tipo, expressas ou implícitas, incluindo, mas não se
              limitando a, garantias implícitas de comercialização, adequação a um propósito específico, não violação ou
              desempenho.
            </p>
            <p>
              O Portal Educacional, seus diretores, funcionários, parceiros, agentes, fornecedores ou afiliados não
              garantem que (i) o Portal funcionará ininterruptamente, de forma segura ou estará disponível em qualquer
              momento ou local específico; (ii) quaisquer erros ou defeitos serão corrigidos; (iii) o Portal está livre
              de vírus ou outros componentes prejudiciais; ou (iv) os resultados do uso do Portal atenderão aos seus
              requisitos.
            </p>

            <h2>11. Lei Aplicável</h2>
            <p>
              Estes Termos serão regidos e interpretados de acordo com as leis do Brasil, sem consideração aos seus
              conflitos de princípios legais.
            </p>
            <p>
              Nossa falha em fazer valer qualquer direito ou disposição destes Termos não será considerada uma renúncia
              a esses direitos. Se qualquer disposição destes Termos for considerada inválida ou inexequível por um
              tribunal, as disposições restantes destes Termos permanecerão em vigor.
            </p>

            <h2>12. Alterações nos Termos</h2>
            <p>
              Reservamo-nos o direito, a nosso exclusivo critério, de modificar ou substituir estes Termos a qualquer
              momento. Se uma revisão for material, tentaremos fornecer um aviso com pelo menos 30 dias de antecedência
              antes que quaisquer novos termos entrem em vigor.
            </p>
            <p>
              O que constitui uma alteração material será determinado a nosso exclusivo critério. Ao continuar a acessar
              ou usar nosso Portal após essas revisões se tornarem efetivas, você concorda em ficar vinculado aos termos
              revisados. Se você não concordar com os novos termos, por favor, pare de usar o Portal.
            </p>

            <h2>13. Contato</h2>
            <p>
              Se você tiver alguma dúvida sobre estes Termos, entre em contato conosco pelo e-mail:
              suporte@portaleducacional.com.br
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

