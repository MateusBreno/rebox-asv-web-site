// ./src/pages/privates/Setting/index.tsx
import React from 'react';

import {
  HeaderNavigationPrivate,
  MenuSideBarPrivate,
  SubtitleSecondary,
} from '@components/index';

import { Container, ContainerGroup, Content } from './styles';

const Setting: React.FC = () => {
  return (
    <Container>
      <HeaderNavigationPrivate />
      <ContainerGroup>
        <MenuSideBarPrivate />
        <Content>
          <SubtitleSecondary textAlign="start">Configurações</SubtitleSecondary>
        </Content>
      </ContainerGroup>
    </Container>
  );
};

export default Setting;
