// ./src/pages/privates/Notification/index.tsx
import React from 'react';

import {
  HeaderNavigationPrivate,
  MenuSideBarPrivate,
  SubtitleSecondary,
} from '@components/index';

import { Container, ContainerGroup, Content } from './styles';

const Notification: React.FC = () => {
  return (
    <Container>
      <HeaderNavigationPrivate />
      <ContainerGroup>
        <MenuSideBarPrivate />
        <Content>
          <SubtitleSecondary textAlign="start">Notificações</SubtitleSecondary>
        </Content>
      </ContainerGroup>
    </Container>
  );
};

export default Notification;
