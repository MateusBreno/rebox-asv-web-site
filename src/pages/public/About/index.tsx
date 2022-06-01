import React, { useCallback, useState } from 'react';

import { ImageTeam } from '@assets/images';
import {
  HeaderNavigationPublic,
  FooterPublic,
  MenuSideBarPublic,
} from '@components/index';
import { ConfigBase } from '@config/index';

import {
  Container,
  CompanyConcepts,
  Our,
  OurDescription,
  OurTitle,
  WhoWeAre,
  WhoWeAreDescription,
  WhoWeAreTitle,
  WhoWeAreInfomation,
  Affiliate,
  ButtonOur,
  OurLink,
} from './styles';

const About: React.FC = () => {
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

      <WhoWeAre>
        <WhoWeAreInfomation>
          <WhoWeAreTitle>Quem somos nós?</WhoWeAreTitle>
          <WhoWeAreDescription>
            <p>
              Vivemos em uma nova realidade, onde todos estão conectados à
              internet. Praticamente todas as atividades cotidianas são
              resolvidas através da rede de computadores.
            </p>
            <p>
              Foi pensando nesse “novo mundo”, que a{' '}
              <b>REBOX nasceu para cuidar do CARRO</b> de uma forma rápida e
              descomplicada. A REBOX é uma{' '}
              <b>plataforma online de assistência veicular 24h</b>, voltada para
              cuidar do seu carro no momento em que você mais precisar.
            </p>
            <p>
              Através de nossa plataforma online, os clientes solicitam serviços
              de REBOQUE, PANE ELÉTRICA, SOCORRO MECÂNICO, FALTA DE COMBUSTÍVEL,
              TROCA DE PNEU, CHAVEIRO AUTO, além de uma gama de descontos em
              centenas lojas e empresas conveniadas à REBOX, proporcionando ao
              cliente, ECONOMIA, PRATICIDADE e QUALIDADE. Para isso, a REBOX
              conta com uma das maiores redes de assistência do país,{' '}
              <b>
                treinada e habilitada para atender 24 horas por dia, 7 dias por
                semana
              </b>
              , objetivando sempre superar as expectativas dos nossos clientes.
            </p>
          </WhoWeAreDescription>
        </WhoWeAreInfomation>
        <div className="banner">
          <ImageTeam />
        </div>
      </WhoWeAre>

      <CompanyConcepts>
        <Our>
          <OurTitle>Nossa missão é</OurTitle>
          <OurDescription>
            <p>
              Atuar de forma rápida, segura e transparente nas demandas de
              emergências/sinistros de nossos usuários e associados, sem abrir
              mão da excelência na prestação de serviços de assistência 24
              horas, criando assim um elo de amizade e confiança.
            </p>
          </OurDescription>
        </Our>

        <Our>
          <OurTitle>Nossa visão é</OurTitle>
          <OurDescription>
            <p>
              Ser referência no mercado de assistência 24 horas para os usuários
              e associados, buscando sempre a qualidade na prestação dos
              serviços e a satisfação do nosso cliente final como FOCO.
            </p>
          </OurDescription>
        </Our>

        <Our>
          <OurTitle>Nossos valores são</OurTitle>
          <OurDescription>
            <p>
              Primar pela ética na organização e nos negócios, respeitando todos
              que, direta ou indiretamente, participam de todos os processos.
            </p>
          </OurDescription>
        </Our>
      </CompanyConcepts>

      {/* <Affiliate>
        <OurTitle>Para afiliados</OurTitle>
        <OurDescription>
          <p>
            Agente sabe que não ta fácil pra ninguém, não é mesmo? Mas você já
            parou pra pensar quantas pessoas você conhece que tem um carro e não
            tem um seguro, por ser muito caro?
          </p>
          <p>
            Que tal você ganhar dinheiro indicando os planos de assistência 24h
            da Rebox? Com nossos planos, seu amigo(a) economiza no cuidado com o
            seu carro e você ganha dinheiro, através da indicação!!! Afinal de
            contas, uma renda extra sempre ajuda...
          </p>
          <p>
            Crie seu cadastro gratuitamente e tenha o seu código de indicação e
            um link de compartilhamento e comece a ganhar dinheiro! E o melhor
            de tudo: Você controla tudo na palma da mão e solicita a sua
            comissão na hora que quiser.
          </p>
        </OurDescription>

        <div className="text-start">
          <OurLink
            to={{
              pathname: `${ConfigBase.affiliateBaseURL}/cadastro`,
            }}
            target="_blank"
          >
            <ButtonOur>Cadastre-se</ButtonOur>
          </OurLink>
          <OurLink to="/" className="link">
            <p>Consulte as regras de afiliação</p>
          </OurLink>
        </div>
      </Affiliate> */}

      {/* <Affiliate>
        <OurTitle>Para empresas</OurTitle>
        <OurDescription>
          <p>
            Você que é frotista ou locadora, traga seus veículos para REBOX e
            veja como podemos agregar valor ao seu negócio.
          </p>
          <p>
            Entre em contato através de um dos nossos canais de atendimento:
          </p>
          <p>
            Pelo telefone <b>0800 100 1100</b>
          </p>
          <p>
            Ou pelo WhatsApp <b>(21) 98384-6769</b>
          </p>
          <p>
            E também pelo nosso e-mail <b>faleconosco@rebox.com.br</b>
          </p>
        </OurDescription>
      </Affiliate> */}

      <FooterPublic />
    </Container>
  );
};

export default About;
