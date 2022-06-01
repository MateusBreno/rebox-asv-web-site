// ./src/pages/privates/Profile/index.tsx
import React, { useState } from 'react';

import { FiLock } from 'react-icons/fi';

import {
  HeaderNavigationPrivate,
  MenuSideBarPrivate,
  SubtitleSecondary,
  Paragraph,
  FormProfileAddress,
  FormProfileUser,
  ModalUserPassword,
  ButtonDefault,
} from '@components/index';
import { sessionStorageService } from '@services/index';

import {
  Container,
  ContainerGroup,
  Content,
  Tabs,
  TabLabels,
  TabItems,
  TabLabelsButton,
  ButtonsOption,
} from './styles';

const Profile: React.FC = () => {
  const [tab, setTab] = useState<number>(1);
  const [modalPasswordIsOpen, setModalPasswordIsOpen] =
    useState<boolean>(false);

  const changeModalPasswordIsOpen = () => {
    setModalPasswordIsOpen(prevState => !prevState);
  };

  return (
    <Container>
      <HeaderNavigationPrivate />
      <ContainerGroup>
        <MenuSideBarPrivate />
        <Content>
          <SubtitleSecondary textAlign="start">Perfil</SubtitleSecondary>
          <ButtonsOption>
            <ButtonDefault
              iconLeft={FiLock}
              style={{ maxWidth: 200 }}
              onClick={changeModalPasswordIsOpen}
            >
              Alterar senha
            </ButtonDefault>
          </ButtonsOption>
          <Tabs>
            <TabLabels>
              <TabLabelsButton
                style={{ borderRadius: '10px 0 0' }}
                isActive={tab === 1}
                onClick={() => setTab(1)}
              >
                <Paragraph style={{ fontWeight: 500 }}>
                  Dados pessoais
                </Paragraph>
              </TabLabelsButton>
              <TabLabelsButton
                style={{ borderRadius: '0 10px 0 0' }}
                isActive={tab === 2}
                onClick={() => setTab(2)}
              >
                <Paragraph style={{ fontWeight: 500 }}>Endereço</Paragraph>
              </TabLabelsButton>
              {/* <TabLabelsButton isActive={tab === 3} onClick={() => setTab(3)}>
                <Paragraph style={{ fontWeight: 500 }}>Notificações</Paragraph>
              </TabLabelsButton> */}
            </TabLabels>
            <TabItems>
              {tab === 1 && <FormProfileUser />}
              {tab === 2 && <FormProfileAddress />}
            </TabItems>
          </Tabs>
        </Content>
      </ContainerGroup>
      <ModalUserPassword
        userId={sessionStorageService.getUser()?.id || ''}
        isOpen={modalPasswordIsOpen}
        change={changeModalPasswordIsOpen}
      />
    </Container>
  );
};

export default Profile;
