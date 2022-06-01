import React, { useCallback, useState } from 'react';

import {
  HeaderNavigationPublic,
  FooterPublic,
  MenuSideBarPublic,
} from '@components/index';

import { Container, Content, Title, Subtitle } from './styles';

const PrivacyPolicy: React.FC = () => {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  const handleOpenSidebar = useCallback(() => {
    setSidebarIsOpen(!sidebarIsOpen);
  }, [sidebarIsOpen]);

  return (
    <Container sidebarIsOpen={sidebarIsOpen}>
      <MenuSideBarPublic
        handleOpenSidebar={handleOpenSidebar}
        sidebarIsOpen={sidebarIsOpen}
      />

      <HeaderNavigationPublic handleOpenSidebar={handleOpenSidebar} />

      <Content>
        <Title>POLÍTICA DE PRIVACIDADE</Title>

        <p>
          Ao acessar as páginas desse site, você concorda com a seguinte
          política de privacidade, conforme definida abaixo. Caso não concorde
          com a presente Política, interrompa o uso do presente site.
        </p>

        <p>
          A Rebox Soluções Integradas Ltda poderá alterar a presente Política,
          modificar ou impedir o acesso ao presente site ou ao seu conteúdo a
          qualquer momento, com ou sem notificação, de forma que o usuário
          deverá confirmar a presente Política antes de cada visita ou uso do
          presente site.
        </p>

        <p>
          A Rebox Soluções Integradas Ltda compromete-se a proteger a
          privacidade dos visitantes de seus sites. A Rebox Soluções Integradas
          Ltda não se envolve na prática de venda ou intercâmbio de dados
          pessoais com terceiros para fins promocionais. Ao utilizar o presente
          site, o usuário reconhece e aceita que a Rebox Soluções Integradas
          Ltda poderá coletar, utilizar e divulgar algumas informações de
          identificação pessoal do tipo e para os fins descritos na Política. A
          Rebox Soluções Integradas Ltda somente reterá referidas informações
          pelo tempo que for necessário para atender a tais finalidades. A Rebox
          Soluções Integradas Ltda também poderá fornecer dados estatísticos e
          compartilhar informações gerais a respeito dos modelos de tráfego do
          presente site, além de outras informações relacionadas com o site a
          terceiros idôneos, ressalvando-se que tais dados estatísticos não
          incluirão informações de identificação pessoal.
        </p>

        <p>
          O site da Rebox Soluções Integradas Ltda enviam informações ao
          computador do usuário para permitir que o mesmo seja identificado, bem
          como para determinar se referido usuário está visitando o site pela
          primeira vez. Tais informações denominam-se <i>&quot;cookies&quot;</i>
          . Ao indicar como e quando os visitantes utilizam o presente site,
          estas informações podem ajudar a Rebox Soluções Integradas Ltda a
          continuar a melhorar seus serviços.
        </p>

        <p>
          Caso o presente site permita ao usuário entrar em contato com a Rebox
          Soluções Integradas Ltda para obter esclarecimentos ou para o
          atendimento de solicitações, poderá ser necessário a solicitação de
          informações pessoais a seu respeito como por exemplo, nome, endereço,
          números de identidade, e-mail e número de telefone. A Rebox Soluções
          Integradas Ltda poderá utilizar estas informações para responder às
          solicitações do usuário por correio, e-mail ou telefone. Se o usuário
          solicitar serviços ou submeter conteúdo ao presente site, a Rebox
          Soluções Integradas Ltda poderá precisar entrar em contato com o
          usuário para obter as informações adicionais necessárias para
          processar ou atender a um pedido ou solicitação.
        </p>

        <p>
          O fato de fornecer informações pessoais para a Rebox Soluções
          Integradas Ltda, no presente site, não levará ao recebimento pelo
          usuário de informações a respeito da Rebox Soluções Integradas Ltda ou
          de seus serviços ou promoções, a menos que o usuário expressamente
          solicite o recebimento de referidas informações.
        </p>

        <p>
          A Rebox Soluções Integradas Ltda não fornecerá as informações
          apresentadas a terceiros sem a permissão do respectivo usuário, exceto
          quando forem necessárias para processar ou atender os pedidos do
          mesmo, inclusive, mas sem se limitar, ao fornecimento das informações
          necessárias a bancos, instituições financeiras ou seguradoras, assim
          como para responder às solicitações ou consultas do usuário, ou se, de
          boa-fé, a Rebox Soluções Integradas Ltda acreditar que a divulgação
          das informações é justificadamente necessária para responder a
          reclamações de que o conteúdo que o usuário submeteu ao presente site
          infringe os direitos de terceiros ou é necessária para proteger os
          direitos, propriedades e/ou segurança da Rebox Soluções Integradas
          Ltda, dos usuários do site e/ou do público em geral.
        </p>

        <p>
          A Rebox Soluções Integradas Ltda também tem o direito, mas não a
          obrigação, de reter e utilizar as informações armazenadas em seus
          bancos de dados, além de outras informações obtidas a partir das
          atividades atuais ou anteriores do usuário no presente site, por um
          prazo razoável, que não venha a exceder os requisitos ou limitações
          legais, para dirimir disputas, solucionar problemas e fazer valer os
          direitos legais da Rebox Soluções Integradas Ltda, assim como os
          termos e condições da Política. Em raras ocasiões, a Rebox Soluções
          Integradas Ltda poderá examinar suas informações de modo a identificar
          usuários com múltiplas identidades ou pseudônimos para fins legais
          e/ou de segurança. Queira também observar que, se a Rebox Soluções
          Integradas Ltda for obrigada por lei, ordem judicial ou outro processo
          legal a divulgar alguma das informações pessoais de qualquer usuário a
          um tribunal ou a terceiros, a Rebox Soluções Integradas Ltda, quando
          permitido, irá procurar notificar o usuário em questão com
          antecedência por meio dos dados para contato fornecidos por referido
          usuário.
        </p>

        <p>
          A Rebox Soluções Integradas Ltda empenhou-se em tomar medidas
          comercialmente razoáveis para impedir o acesso desautorizado e o uso
          indevido das informações pessoais dos usuários. Queira observar que,
          embora sempre haja riscos associados ao fornecimento de dados
          pessoais, seja pessoalmente, por telefone ou via outras tecnologias
          pela internet e nenhum sistema de tecnologia seja totalmente seguro (à
          prova de adulteração ou à prova da ação de hackers), a Rebox Soluções
          Integradas Ltda empenhou-se em tomar precauções razoáveis e
          apropriadas à sensibilidade das informações com o fito de evitar e
          minimizar referidos riscos relacionados com a utilização do presente
          site pelo usuário.
        </p>

        <p>
          Não poderão ser submetidas informações ao presente site por pessoas
          com idade inferior a 18 anos sem o consentimento dos pais ou
          responsável.
        </p>

        <p>
          O presente site pode conter links para outros sites externos cujos
          conteúdos e políticas de privacidade não são de responsabilidade da
          Rebox Soluções Integradas Ltda.
        </p>

        <Title>USO DE DADOS PESSOAIS</Title>

        <p>
          Considerando nossa transparência, detalhamos a seguir como e quais
          tipos de dados pessoais serão coletados, a razão da coleta e com quem
          é compartilhado.
        </p>

        <Subtitle>Quem é o controlador de dados?</Subtitle>

        <p>
          O controlador de dados é a pessoa física ou jurídica que controla e é
          responsável por manter e usar dados pessoais em papel ou formato
          eletrônico. A Rebox Soluções Integradas Ltda atua como controladora de
          dados quando comercializa seus serviços diretamente ao consumidor
          final conforme definido pelas leis de proteção de dados.
        </p>

        <Subtitle>Que dados pessoais serão coletados?</Subtitle>

        <p>
          Quando você acessa o site da Rebox Soluções Integradas Ltda, nosso
          servidor registra automaticamente os detalhes da sua visita (por
          exemplo, o seu endereço IP, o site a partir do qual nos visita, o tipo
          de software de navegador utilizado, as páginas do site da Rebox
          Soluções Integradas Ltda que você acessa, incluindo a data e duração
          da sua visita). Além disso, coletamos dados pessoais que você fornece
          através do site tais como nome, endereço, endereço de e-mail, número
          de telefone, dentre outros. Caso necessário, considerando o
          fornecimento dos serviços contratados, a Rebox Soluções Integradas
          Ltda poderá ter a necessidade de coletar e processar dados pessoais
          sensíveis como, por exemplo, questões de saúde, óbito, eventuais
          deficiências, dentre outros.
        </p>

        <Subtitle>Como coletaremos e usaremos seus dados pessoais?</Subtitle>

        <p>
          Recolheremos e usaremos seus dados pessoais para uma série de
          propósitos (com seu consentimento quando necessário) conforme a
          seguir:
        </p>

        <ul>
          <li>
            Administração técnica, pesquisa e desenvolvimento de nossos sites;
          </li>
          <li>
            Informá-lo sobre nossos serviços considerando suas preferências;
          </li>
          <li>Pagamento online dos serviços contratados;</li>
          <li>Entrega dos serviços contratados quando solicitado.</li>
        </ul>

        <p>
          Além dos dados fornecidos por você diretamente, a Rebox Soluções
          Integradas Ltda poderá processar outras informações sobre você que
          receber de fontes públicas, parceiros comerciais, autoridades locais,
          dentre outros.
        </p>

        <p>
          Para os propósitos indicados acima, quando indicamos que não exigimos
          o seu consentimento expresso ou que de outra forma solicitamos seus
          dados pessoais para entregar o serviço contratado, processaremos seus
          dados pessoais com base em nossos legítimos interesses e/ou para
          cumprir nossas obrigações legais.
        </p>

        <p>
          Reforçamos que precisamos de seus dados pessoais se desejar comprar
          nossos serviços. Se você não deseja fornecer algum tipo de informação,
          talvez não possamos fornecer os serviços que você está interessado ou
          para adaptar as nossas ofertas ao seu perfil.
        </p>

        <Subtitle>
          Quem poderá ter acesso aos seus dados pessoais considerando nossa
          relação comercial?
        </Subtitle>

        <p>
          Garantimos que seus dados pessoais sejam processados de forma
          compatível com os propósitos indicados anteriormente considerando
          única e exclusivamente o escopo de nossa relação comercial. Se
          necessário, seus dados pessoais podem ser divulgados às seguintes
          partes:
        </p>

        <p>
          Consultores técnicos, advogados, prestadores e empresas de serviços
          diversos;
        </p>

        <p>
          Anunciantes e redes de publicidade para enviar comunicações de
          marketing, conforme permitido pela legislação local e de acordo com
          suas preferências de comunicação. Nós não compartilhamos seus dados
          pessoais com terceiros não afiliados para seu próprio uso de marketing
          sem sua permissão;
        </p>

        <p>
          No caso de qualquer reorganização, fusão, venda, joint venture,
          cessão, transferência ou outra alienação contemplada ou efetiva de
          toda ou parte de nossos negócios, ativos ou ações (inclusive em
          qualquer insolvência ou processo similar) ou cumprimento de qualquer
          obrigação legal.
        </p>

        <Subtitle>Onde meus dados pessoais serão processados?</Subtitle>

        <p>
          Os seus dados pessoais podem ser processados dentro e fora do
          território brasileiro, sujeito sempre às restrições contratuais
          relacionadas a confidencialidade e segurança, de acordo com as leis e
          regulamentos aplicáveis a proteção de dados. Em hipótese alguma,
          divulgamos seus dados pessoais a partes que não estão autorizadas a
          processá-los.
        </p>

        <Subtitle>
          Quais são seus direitos em relação aos seus dados pessoais?
        </Subtitle>

        <p>
          Quando previsto pela legislação brasileira ou regulamentação
          aplicável, você poderá ter o direito de:
        </p>

        <ul>
          <li>
            Acessar seus dados pessoais e saber a sua origem, os propósitos e os
            fins do processamento, os detalhes do(s) controlador(es),
            processador(es) e as partes a quem os dados podem ser divulgados;
          </li>
          <li>
            Retirar seu consentimento para que seus dados pessoais sejam
            utilizados e processados;
          </li>
          <li>
            Atualizar ou corrigir seus dados pessoais para que eles sejam
            precisos;
          </li>
          <li>
            Excluir seus dados pessoais de nossos registros se ele não for mais
            necessário para nossa relação comercial;
          </li>
          <li>
            Restringir o processamento de seus dados pessoais em determinadas
            circunstâncias;
          </li>
          <li>
            Obter seus dados pessoais em um formato eletrônico para
            portabilidade; e
          </li>
          <li>
            Apresentar uma reclamação conosco e/ou a autoridade competente de
            proteção de dados.
          </li>
        </ul>

        <p>
          Você pode exercer esses direitos contatando-nos fornecendo seu nome
          completo, endereço de e-mail, CPF e finalidade de sua solicitação.
        </p>

        <Subtitle>
          Como você pode se opor ao processamento de seus dados pessoais?
        </Subtitle>

        <p>
          Quando previsto pela legislação aplicável, você tem o direito de se
          opor ao processamento de seus dados pessoais, ou solicitar a
          interrupção do processamento (inclusive para fins de publicidade). Uma
          vez que você nos informou sobre este pedido, não devemos processar
          seus dados pessoais, a menos que permitido pelas leis e
          regulamentações aplicáveis.
        </p>

        <p>
          Você pode exercer esse direito da mesma forma que para os outros
          direitos mencionados anteriormente.
        </p>

        <Subtitle>
          Por quanto tempo mantemos seus dados pessoais armazenados?
        </Subtitle>

        <p>
          Nós mantemos seus dados pessoais armazenados por no mínimo 5 anos a
          partir da data de término de nossa relação comercial, contudo, há
          situações previstas na legislação que esse período poderá ser
          estendido.
        </p>

        <p>
          Não conservaremos seus dados pessoais por mais tempo do que o
          necessário e os manteremos apenas para os fins para os quais foram
          obtidos.
        </p>

        <Subtitle>Como você pode nos contatar?</Subtitle>

        <p>
          Se você tiver alguma solicitação de retificação, exclusão ou
          portabilidade de seus dados pessoais, envie um e-mail para{' '}
          <a href="mailto:faleconosco@rebox.com.br">faleconosco@rebox.com.br</a>{' '}
          ou uma carta de próprio punho para:
        </p>

        <Subtitle>
          Com que frequência atualizamos esse aviso de privacidade?
        </Subtitle>

        <p>
          Revisamos regularmente este aviso de privacidade e garantiremos que a
          versão mais recente esteja disponível em nosso site.
        </p>

        <Subtitle>Outras informações pertinentes</Subtitle>

        <h3>Formas de rastreamento</h3>

        <p>
          A Rebox Soluções Integradas Ltda utiliza cookies ou tags, para coletar
          informações para entender como os visitantes usam o nosso site. Essa
          tecnologia de rastreamento nos ajuda a gerenciar e melhorar a
          utilização de nosso site, por exemplo, detectando se houve algum
          contato entre seu computador e nós no passado para identificar as
          seções mais populares do site.
        </p>

        <p>
          Recusar, desabilitar ou desativar tecnologias de rastreamento pode
          resultar em uma disponibilidade reduzida dos conteúdos fornecidos pelo
          site da Rebox Soluções Integradas Ltda.
        </p>

        <h3>Dados trafegados pela Internet</h3>

        <p>
          A Internet não é considerada um ambiente seguro, e as informações
          enviadas pela Internet podem ser acessadas por terceiros não
          autorizados, levando potencialmente a divulgações, alterações de
          conteúdo ou falhas técnicas. Mesmo que o remetente e o destinatário da
          informação estejam localizados no mesmo país, as informações enviadas
          pela Internet podem ser transmitidas através das fronteiras
          internacionais e encaminhadas para um país com nível de proteção de
          dados inferior ao existente no seu país de residência.
        </p>

        <p>
          Por favor, observe que não assumimos qualquer responsabilidade pela
          segurança das suas informações durante o trânsito pela Internet.
        </p>

        <Title>PROCESSAMENTO DE DADOS PESSOAIS SENSÍVEIS</Title>

        <p>
          Ao aceitar nossa Política você nos dá seu consentimento para, se
          necessário, coletar e processar informações sensíveis para que
          possamos prover os serviços contratados por você. Caso você não
          concorde, nós não podemos oferecer os serviços de forma adequada
          considerando a particularidade de cada caso.
        </p>

        <p>
          A Rebox Soluções Integradas Ltda, quando necessário, pode compartilhar
          seus dados de saúde com prestadores de serviço como médicos e
          hospitais para que eles possam usar na prestação do serviço
          contratado. Nesse contexto, destacamos que a Rebox Soluções Integradas
          Ltda possui acordos específicos com essas instituições para proteger
          seus dados.
        </p>
      </Content>
      <FooterPublic />
    </Container>
  );
};

export default PrivacyPolicy;
