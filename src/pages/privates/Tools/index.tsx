// src/pages/privates/Tools/index.tsx
import React from 'react';

import { FiPlus } from 'react-icons/fi';
import { IoIosConstruct, IoIosPaperPlane } from 'react-icons/io';
import { IoArrowForward, IoCube } from 'react-icons/io5';
import { useHistory } from 'react-router-dom';

import {
  HeaderNavigationPrivate,
  MenuSideBarPrivate,
  SubtitleSecondary,
  CardHorizontalButtonNavigate,
  ButtonDefault,
} from '@components/index';
import { ConfigStyles, ConfigRoutes } from '@config/index';
import { formatText } from '@utils/formatters';

import { Container, ContainerGroup, Content, CardItems } from './styles';

const Tools: React.FC = () => {
  const { push } = useHistory();
  return (
    <Container>
      <HeaderNavigationPrivate />
      <ContainerGroup>
        <MenuSideBarPrivate />
        <Content>
          <SubtitleSecondary textAlign="start">Ferramentas</SubtitleSecondary>
          <CardItems>
            <CardHorizontalButtonNavigate
              icon={{
                element: IoIosPaperPlane,
                size: 20,
                opacity: 1,
                colorDefault: ConfigStyles.rebox.colors.black.opacity.average,
                colorHover: ConfigStyles.rebox.colors.white.main,
              }}
              label={{
                text: 'Gestor da comunicação de cobranças',
                colorDefault: ConfigStyles.rebox.colors.black.opacity.average,
                colorHover: ConfigStyles.rebox.colors.white.main,
              }}
              message={{
                text:
                  'Realizar notificações de cobranças pendentes e atrasadas.',
                colorDefault: ConfigStyles.rebox.colors.black.opacity.average,
                colorHover: ConfigStyles.rebox.colors.white.main,
              }}
              positionContent="flex-start"
              marginBottom="2vh"
              onClick={() =>
                push(ConfigRoutes.rebox.privates.tools.next.communication.path)
              }
              options={
                <IoArrowForward
                  size={16}
                  color={ConfigStyles.rebox.colors.black.main}
                  opacity={1}
                />
              }
            />

            <CardHorizontalButtonNavigate
              icon={{
                element: IoCube,
                size: 20,
                opacity: 1,
                colorDefault: ConfigStyles.rebox.colors.black.opacity.average,
                colorHover: ConfigStyles.rebox.colors.white.main,
              }}
              label={{
                text: 'Gestor de produtos',
                colorDefault: ConfigStyles.rebox.colors.black.opacity.average,
                colorHover: ConfigStyles.rebox.colors.white.main,
              }}
              message={{
                text:
                  'Visualizar todos os nossos planos de assinatura, criar um novo produto, fazer edições e exclusões.',
                colorDefault: ConfigStyles.rebox.colors.black.opacity.average,
                colorHover: ConfigStyles.rebox.colors.white.main,
              }}
              positionContent="flex-start"
              marginBottom="2vh"
              onClick={() =>
                push(ConfigRoutes.rebox.privates.tools.next.products.path)
              }
              options={
                <IoArrowForward
                  size={16}
                  color={ConfigStyles.rebox.colors.black.main}
                  opacity={1}
                />
              }
            />

            <CardHorizontalButtonNavigate
              icon={{
                element: IoIosConstruct,
                size: 20,
                opacity: 1,
                colorDefault: ConfigStyles.rebox.colors.black.opacity.average,
                colorHover: ConfigStyles.rebox.colors.white.main,
              }}
              label={{
                text: 'Gestor de serviços',
                colorDefault: ConfigStyles.rebox.colors.black.opacity.average,
                colorHover: ConfigStyles.rebox.colors.white.main,
              }}
              message={{
                text:
                  'Visualizar todos os serviços que oferecemos, adicionar um novo, fazer edições e exclusões.',
                colorDefault: ConfigStyles.rebox.colors.black.opacity.average,
                colorHover: ConfigStyles.rebox.colors.white.main,
              }}
              positionContent="flex-start"
              marginBottom="2vh"
              onClick={() =>
                push(ConfigRoutes.rebox.privates.tools.next.services.path)
              }
              options={
                <IoArrowForward
                  size={16}
                  color={ConfigStyles.rebox.colors.black.main}
                  opacity={1}
                />
              }
            />
          </CardItems>
        </Content>
      </ContainerGroup>
    </Container>
  );
};

export default Tools;
