// ./src/components/forms/FormAffiliateSettings/index.tsx
// eslint-disable-next-line
import React, { useState } from 'react';
// eslint-disable-next-line
import { FiLock } from 'react-icons/fi';
// eslint-disable-next-line
import {
  SubtitleSecondary,
  Paragraph,
  ButtonOutline,
  ModalUserPassword,
} from '@components/index';
// eslint-disable-next-line
import {
  Container,
  Sections,
  SectionsGroup,
  SectionsItem,
} from './styles';

interface IProps {
  userId: string;
}

const FormAffiliateSettings: React.FC<IProps> = ({ userId }) => {
  const [modalPasswordIsOpen, setModalPasswordIsOpen] = useState<boolean>(
    false,
  );

  const changeModalPasswordIsOpen = () => {
    setModalPasswordIsOpen(prevState => !prevState);
  };

  return (
    <Container>
      <Sections>
        <SectionsGroup>
          <SectionsItem>
            <SubtitleSecondary
              textAlign="start"
              nameColor="black"
              fontSize={14}
            >
              Atualizar senha
            </SubtitleSecondary>
            <Paragraph
              nameColor="black"
              textAlign="start"
              opacity={0.5}
              fontSize={13}
              style={{ marginBottom: '2vh' }}
            >
              Por questões de segurança, não escolha uma senha muito fácil
            </Paragraph>
          </SectionsItem>
          <SectionsItem>
            <ButtonOutline
              iconLeft={FiLock}
              style={{ maxWidth: 170 }}
              onClick={changeModalPasswordIsOpen}
            >
              Nova senha
            </ButtonOutline>
          </SectionsItem>
        </SectionsGroup>
        {/* <DividingLine /> */}
      </Sections>
      <ModalUserPassword
        userId={userId}
        isOpen={modalPasswordIsOpen}
        change={changeModalPasswordIsOpen}
      />
    </Container>
  );
};

export default FormAffiliateSettings;
