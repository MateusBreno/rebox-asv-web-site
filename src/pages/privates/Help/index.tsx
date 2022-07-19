// ./src/pages/privates/Help/index.tsx
import React from 'react';

import {
  HeaderNavigationPrivate,
  MenuSideBarPrivate,
  SubtitleSecondary,
} from '@components/index';

import { Container, ContainerGroup, Content } from './styles';

const Help: React.FC = () => {
  return (
    <Container>
      <HeaderNavigationPrivate />
      <ContainerGroup>
        <MenuSideBarPrivate />
        <Content>
          <SubtitleSecondary textAlign="start">Ajuda</SubtitleSecondary>
        </Content>
      </ContainerGroup>
    </Container>
  );
};

export default Help;
