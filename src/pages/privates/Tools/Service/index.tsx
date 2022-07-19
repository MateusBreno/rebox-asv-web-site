// ./src/pages/privates/Services/index.tsx
import React from 'react';

import {
  HeaderNavigationPrivate,
  MenuSideBarPrivate,
  SubtitleSecondary,
} from '@components/index';

import { Container, ContainerGroup, Content } from './styles';

const Service: React.FC = () => {
  return (
    <Container>
      <HeaderNavigationPrivate />
      <ContainerGroup>
        <MenuSideBarPrivate />
        <Content>
          <SubtitleSecondary textAlign="start">Serviços</SubtitleSecondary>
        </Content>
      </ContainerGroup>
    </Container>
  );
};

export default Service;
