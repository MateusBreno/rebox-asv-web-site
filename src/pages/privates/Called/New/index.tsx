// ./src/pages/privates/Called/New/index.tsx
import React, { useState } from 'react';

import { IoArrowBack } from 'react-icons/io5';
import { useHistory } from 'react-router-dom';

import {
  HeaderNavigationPrivate,
  MenuSideBarPrivate,
  SubtitleSecondary,
  ButtonDefault,
  FormCalledNew,
} from '@components/index';

import {
  Container,
  ContainerGroup,
  Content,
  Options,
  OptionsGroup,
} from './styles';

const CalledNew: React.FC = () => {
  const { goBack } = useHistory();
  const [tab, setTab] = useState<number>(1);

  const handleGoBack = () => {
    goBack();
  };

  return (
    <Container>
      <HeaderNavigationPrivate />
      <ContainerGroup>
        <MenuSideBarPrivate />
        <Content>
          <SubtitleSecondary textAlign="start">
            Acionar serviço
          </SubtitleSecondary>
          <Options>
            <OptionsGroup>
              <ButtonDefault iconLeft={IoArrowBack} onClick={handleGoBack} />
            </OptionsGroup>
          </Options>
          <FormCalledNew />
        </Content>
      </ContainerGroup>
    </Container>
  );
};

export default CalledNew;
