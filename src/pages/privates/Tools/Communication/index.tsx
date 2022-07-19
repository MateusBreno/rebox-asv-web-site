// src/pages/privates/Tools/Communication/index.tsx
import React from 'react';

import { IoArrowBack } from 'react-icons/io5';
import { useHistory } from 'react-router-dom';

import {
  HeaderNavigationPrivate,
  MenuSideBarPrivate,
  SubtitleSecondary,
  FormCommunication,
  ButtonDefault,
} from '@components/index';

import {
  Container,
  ContainerGroup,
  Content,
  Options,
  OptionsGroup,
} from './styles';

const Communication: React.FC = () => {
  const { goBack } = useHistory();

  const handleGoBack = () => {
    goBack();
  };

  return (
    <Container>
      <HeaderNavigationPrivate />
      <ContainerGroup>
        <MenuSideBarPrivate />
        <Content>
          <SubtitleSecondary textAlign="start">Comunicação</SubtitleSecondary>
          <Options>
            <OptionsGroup>
              <ButtonDefault iconLeft={IoArrowBack} onClick={handleGoBack} />
            </OptionsGroup>
          </Options>
          <FormCommunication />
        </Content>
      </ContainerGroup>
    </Container>
  );
};

export default Communication;
