import Link from "next/link"
import type { Metadata } from "next"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Política de Privacidade | Portal Educacional",
  description: "Política de Privacidade do Portal Educacional",
}

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold text-primary mb-6">Política de Privacidade</h1>
          <p className="text-muted-foreground mb-6">Última atualização: {new Date().toLocaleDateString("pt-BR")}</p>

          <div className="prose prose-slate max-w-none">
            <h2>1. Introdução</h2>
            <p>
              O Portal Educacional ("nós", "nosso" ou "Portal") está comprometido em proteger sua privacidade. Esta
              Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando
              você utiliza nosso portal web e serviços relacionados ("Serviços").
            </p>
            <p>
              Ao utilizar nossos Serviços, você concorda com a coleta e uso de informações de acordo com esta política.
              Processamos seus dados pessoais apenas para os fins descritos nesta Política de Privacidade e em
              conformidade com a legislação de proteção de dados aplicável, incluindo a Lei Geral de Proteção de Dados
              (LGPD) do Brasil, o Regulamento Geral de Proteção de Dados (GDPR) da União Europeia e a Lei de Privacidade
              do Consumidor da Califórnia (CCPA), conforme aplicável.
            </p>

            <h2>2. Informações que Coletamos</h2>
            <p>Coletamos vários tipos de informações para fornecer e melhorar nossos Serviços para você:</p>

            <h3>2.1 Informações Pessoais</h3>
            <p>Quando você se registra em nossa plataforma, podemos coletar as seguintes informações pessoais:</p>
            <ul>
              <li>Nome completo</li>
              <li>Endereço de e-mail</li>
              <li>Número de telefone (opcional)</li>
              <li>Perfil de usuário (professor, estudante ou responsável)</li>
              <li>Instituição de ensino (quando aplicável)</li>
              <li>Foto de perfil (opcional)</li>
            </ul>

            <h3>2.2 Informações de Uso</h3>
            <p>Também coletamos informações sobre como você acessa e usa nossos Serviços:</p>
            <ul>
              <li>Dados de log, incluindo endereço IP, tipo de navegador, páginas visitadas, tempo de acesso</li>
              <li>Informações do dispositivo, como tipo de dispositivo, sistema operacional, identificadores únicos</li>
              <li>
                Dados de interação com o conteúdo, como posts visualizados, comentários feitos, materiais baixados
              </li>
              <li>Preferências de configuração e personalização da plataforma</li>
            </ul>

            <h3>2.3 Cookies e Tecnologias Semelhantes</h3>
            <p>
              Utilizamos cookies e tecnologias de rastreamento semelhantes para rastrear a atividade em nossos Serviços
              e armazenar certas informações. Os cookies são arquivos com pequena quantidade de dados que podem incluir
              um identificador único anônimo.
            </p>
            <p>
              Você pode instruir seu navegador a recusar todos os cookies ou indicar quando um cookie está sendo
              enviado. No entanto, se você não aceitar cookies, pode não conseguir usar algumas partes de nossos
              Serviços.
            </p>
            <p>Utilizamos os seguintes tipos de cookies:</p>
            <ul>
              <li>
                <strong>Cookies Essenciais:</strong> Necessários para o funcionamento básico do portal
              </li>
              <li>
                <strong>Cookies de Preferências:</strong> Permitem que o portal lembre suas preferências e configurações
              </li>
              <li>
                <strong>Cookies Analíticos:</strong> Ajudam-nos a entender como os usuários interagem com o portal
              </li>
              <li>
                <strong>Cookies de Marketing:</strong> Utilizados para rastrear visitantes em websites com o objetivo de
                exibir anúncios relevantes (quando aplicável)
              </li>
            </ul>

            <h2>3. Como Usamos Suas Informações</h2>
            <p>Utilizamos as informações coletadas para os seguintes propósitos:</p>
            <ul>
              <li>Fornecer, manter e melhorar nossos Serviços</li>
              <li>
                Processar e completar transações, e enviar informações relacionadas, incluindo confirmações e faturas
                (quando aplicável)
              </li>
              <li>
                Enviar comunicações administrativas, como atualizações de produtos, avisos de segurança e mensagens de
                suporte
              </li>
              <li>Responder a comentários, perguntas e solicitações, e fornecer atendimento ao cliente</li>
              <li>
                Enviar comunicações promocionais, como newsletters, materiais educacionais e informações sobre novos
                recursos (com seu consentimento, quando exigido por lei)
              </li>
              <li>Monitorar e analisar tendências, uso e atividades em conexão com nossos Serviços</li>
              <li>Personalizar e melhorar os Serviços e fornecer conteúdo e recursos adaptados aos seus interesses</li>
              <li>
                Detectar, investigar e prevenir atividades fraudulentas e não autorizadas, e proteger os direitos e
                propriedades do Portal e de outros
              </li>
            </ul>

            <h2>4. Base Legal para Processamento</h2>
            <p>Processamos seus dados pessoais com base nas seguintes justificativas legais:</p>
            <ul>
              <li>
                <strong>Execução de Contrato:</strong> O processamento é necessário para a execução de um contrato do
                qual você é parte ou para tomar medidas a seu pedido antes de celebrar um contrato
              </li>
              <li>
                <strong>Consentimento:</strong> Você deu consentimento para o processamento de seus dados pessoais para
                um ou mais propósitos específicos
              </li>
              <li>
                <strong>Interesses Legítimos:</strong> O processamento é necessário para os interesses legítimos
                perseguidos por nós ou por terceiros, exceto quando tais interesses são sobrepostos por seus interesses
                ou direitos e liberdades fundamentais
              </li>
              <li>
                <strong>Obrigação Legal:</strong> O processamento é necessário para o cumprimento de uma obrigação legal
                à qual estamos sujeitos
              </li>
            </ul>

            <h2>5. Compartilhamento de Informações</h2>
            <p>
              Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto conforme descrito
              nesta Política de Privacidade:
            </p>
            <ul>
              <li>
                <strong>Prestadores de Serviços:</strong> Podemos compartilhar suas informações com prestadores de
                serviços terceirizados que realizam serviços em nosso nome, como hospedagem de dados, análise,
                processamento de pagamentos, atendimento ao cliente e marketing
              </li>
              <li>
                <strong>Instituições de Ensino:</strong> Se você é um estudante ou professor, podemos compartilhar
                informações com sua instituição de ensino conforme necessário para fornecer os Serviços
              </li>
              <li>
                <strong>Requisitos Legais:</strong> Podemos divulgar suas informações se exigido por lei, processo legal
                ou solicitação governamental
              </li>
              <li>
                <strong>Proteção de Direitos:</strong> Podemos divulgar informações para proteger a segurança, direitos
                ou propriedade do Portal, de nossos usuários ou do público
              </li>
              <li>
                <strong>Transações Corporativas:</strong> Em caso de fusão, venda de ativos da empresa, financiamento ou
                aquisição de todo ou parte de nosso negócio por outra empresa, as informações podem ser transferidas
                como parte da transação
              </li>
              <li>
                <strong>Com Seu Consentimento:</strong> Podemos compartilhar suas informações com terceiros quando você
                nos autorizar explicitamente a fazê-lo
              </li>
            </ul>

            <h2>6. Retenção de Dados</h2>
            <p>
              Retemos suas informações pessoais pelo tempo necessário para cumprir os propósitos descritos nesta
              Política de Privacidade, a menos que um período de retenção mais longo seja exigido ou permitido por lei.
            </p>
            <p>
              Quando não tivermos mais necessidade legítima de processar suas informações pessoais, excluiremos ou
              anonimizaremos essas informações. Se isso não for possível (por exemplo, porque suas informações pessoais
              foram armazenadas em arquivos de backup), armazenaremos suas informações pessoais de forma segura e as
              isolaremos de qualquer processamento adicional até que a exclusão seja possível.
            </p>

            <h2>7. Transferências Internacionais de Dados</h2>
            <p>
              Suas informações, incluindo dados pessoais, podem ser transferidas para — e mantidas em — computadores
              localizados fora de seu estado, província, país ou outra jurisdição governamental onde as leis de proteção
              de dados podem ser diferentes das de sua jurisdição.
            </p>
            <p>
              Se você está localizado fora do Brasil e opta por nos fornecer informações, observe que transferimos os
              dados, incluindo dados pessoais, para o Brasil e os processamos lá.
            </p>
            <p>
              Seu consentimento com esta Política de Privacidade, seguido pelo envio de tais informações, representa sua
              concordância com essa transferência.
            </p>
            <p>
              Tomaremos todas as medidas razoavelmente necessárias para garantir que seus dados sejam tratados com
              segurança e de acordo com esta Política de Privacidade e nenhuma transferência de seus dados pessoais
              ocorrerá para uma organização ou país, a menos que existam controles adequados, incluindo a segurança de
              seus dados e outras informações pessoais.
            </p>

            <h2>8. Seus Direitos de Proteção de Dados</h2>
            <p>Dependendo de sua localização, você pode ter certos direitos relacionados aos seus dados pessoais:</p>
            <ul>
              <li>
                <strong>Direito de Acesso:</strong> Você tem o direito de solicitar cópias dos seus dados pessoais
              </li>
              <li>
                <strong>Direito de Retificação:</strong> Você tem o direito de solicitar que corrijamos qualquer
                informação que você acredite ser imprecisa ou incompleta
              </li>
              <li>
                <strong>Direito de Exclusão:</strong> Você tem o direito de solicitar que apaguemos seus dados pessoais,
                sob certas condições
              </li>
              <li>
                <strong>Direito de Restrição de Processamento:</strong> Você tem o direito de solicitar que restrinjamos
                o processamento de seus dados pessoais, sob certas condições
              </li>
              <li>
                <strong>Direito de Oposição ao Processamento:</strong> Você tem o direito de se opor ao nosso
                processamento de seus dados pessoais, sob certas condições
              </li>
              <li>
                <strong>Direito à Portabilidade de Dados:</strong> Você tem o direito de solicitar que transfiramos os
                dados que coletamos para outra organização, ou diretamente para você, sob certas condições
              </li>
              <li>
                <strong>Direito de Retirar o Consentimento:</strong> Você tem o direito de retirar seu consentimento a
                qualquer momento, quando o processamento for baseado no consentimento
              </li>
            </ul>
            <p>
              Se você deseja exercer qualquer desses direitos, entre em contato conosco através do e-mail:
              privacidade@portaleducacional.com.br
            </p>
            <p>
              Responderemos a todas as solicitações que recebemos de indivíduos que desejam exercer seus direitos de
              proteção de dados de acordo com as leis de proteção de dados aplicáveis. Podemos solicitar informações
              específicas para nos ajudar a confirmar sua identidade antes de responder à sua solicitação.
            </p>

            <h2>9. Segurança de Dados</h2>
            <p>
              A segurança de seus dados é importante para nós, mas lembre-se que nenhum método de transmissão pela
              Internet ou método de armazenamento eletrônico é 100% seguro. Embora nos esforcemos para usar meios
              comercialmente aceitáveis para proteger seus dados pessoais, não podemos garantir sua segurança absoluta.
            </p>
            <p>
              Implementamos medidas de segurança técnicas e organizacionais apropriadas para proteger seus dados
              pessoais contra perda acidental ou processamento ilegal, incluindo:
            </p>
            <ul>
              <li>Criptografia de dados em trânsito e em repouso</li>
              <li>Controles de acesso rigorosos</li>
              <li>Monitoramento de segurança contínuo</li>
              <li>Treinamento regular de funcionários em práticas de segurança de dados</li>
              <li>Avaliações periódicas de segurança e testes de penetração</li>
            </ul>

            <h2>10. Privacidade de Crianças</h2>
            <p>
              Nossos Serviços podem ser utilizados por crianças e adolescentes no contexto educacional. Reconhecemos a
              importância de proteger a privacidade de crianças e cumprimos com todas as leis aplicáveis relacionadas à
              coleta de dados de crianças, incluindo o Estatuto da Criança e do Adolescente (ECA) no Brasil e a Lei de
              Proteção da Privacidade Online das Crianças (COPPA) nos Estados Unidos.
            </p>
            <p>
              Para usuários menores de 16 anos, coletamos apenas as informações necessárias para fornecer os Serviços
              educacionais e exigimos o consentimento verificável dos pais ou responsáveis legais antes de coletar, usar
              ou divulgar informações pessoais.
            </p>
            <p>
              Se você é pai, mãe ou responsável legal e acredita que seu filho nos forneceu informações pessoais sem seu
              consentimento, entre em contato conosco para que possamos tomar as medidas necessárias para remover essas
              informações.
            </p>

            <h2>11. Links para Outros Sites</h2>
            <p>
              Nossos Serviços podem conter links para outros sites que não são operados por nós. Se você clicar em um
              link de terceiros, será direcionado para o site desse terceiro. Recomendamos fortemente que você revise a
              Política de Privacidade de cada site que visitar.
            </p>
            <p>
              Não temos controle sobre e não assumimos responsabilidade pelo conteúdo, políticas de privacidade ou
              práticas de quaisquer sites ou serviços de terceiros.
            </p>

            <h2>12. Alterações a Esta Política de Privacidade</h2>
            <p>
              Podemos atualizar nossa Política de Privacidade de tempos em tempos. Notificaremos você sobre quaisquer
              alterações publicando a nova Política de Privacidade nesta página e atualizando a data de "última
              atualização" no topo desta Política de Privacidade.
            </p>
            <p>
              Você é aconselhado a revisar esta Política de Privacidade periodicamente para quaisquer alterações.
              Alterações a esta Política de Privacidade são efetivas quando são publicadas nesta página.
            </p>
            <p>
              Para alterações materiais que afetem significativamente seus direitos, forneceremos um aviso mais
              proeminente, que pode incluir notificação por e-mail ou um aviso dentro de nossos Serviços.
            </p>

            <h2>13. Contato</h2>
            <p>Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco:</p>
            <ul>
              <li>Por e-mail: privacidade@portaleducacional.com.br</li>
              <li>Por correio: Portal Educacional, Av. Exemplo, 1234, São Paulo - SP, 01234-567, Brasil</li>
              <li>Pelo formulário de contato em nosso site: www.portaleducacional.com.br/contato</li>
            </ul>
            <p>
              Nosso Encarregado de Proteção de Dados (DPO) pode ser contatado diretamente em:
              dpo@portaleducacional.com.br
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

