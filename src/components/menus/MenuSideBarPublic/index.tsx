import React from 'react';

import { useTranslation } from 'react-i18next';

import { IconUser } from '@assets/icons';
import { ConfigBase, ConfigRoutes } from '@config/index';

import {
  BorderBottom,
  ButtonAreaClient,
  ButtonAreaClientText,
  Container,
  IconContainer,
  IconMenuClose,
  Navbar,
  NavbarText,
} from './styles';

interface ISidebarProps {
  handleOpenSidebar(): void;
  sidebarIsOpen: boolean;
}

const MenuSidebarPublic: React.FC<ISidebarProps> = ({
  handleOpenSidebar,
  sidebarIsOpen,
}) => {
  const { t } = useTranslation(['Home2']);

  return (
    <Container className={`${sidebarIsOpen ? 'sidebar-opened' : ''}`}>
      <IconContainer>
        <IconMenuClose size={40} onClick={handleOpenSidebar} />
      </IconContainer>

      <Navbar>
        <NavbarText to={ConfigRoutes.rebox.publics.landingPage.path}>
          Home
          <BorderBottom />
        </NavbarText>

        <NavbarText to={ConfigRoutes.rebox.publics.assistance.path}>
          Pedir socorro!
          <BorderBottom />
        </NavbarText>

        <NavbarText to={ConfigRoutes.rebox.publics.about.path}>
          Quem somos
          <BorderBottom />
        </NavbarText>

        <NavbarText to={ConfigRoutes.rebox.publics.plan.path}>
          Nossos planos
          <BorderBottom />
        </NavbarText>

        <NavbarText
          to={{
            pathname: `${ConfigBase.rebox.externalLinks.affiliate}`,
          }}
          target="new_blank"
        >
          Para afiliados
          <BorderBottom />
        </NavbarText>

        <NavbarText to={ConfigRoutes.rebox.publics.debts.path}>
          2ª via de boleto
          <BorderBottom />
        </NavbarText>

        {/* <NavbarText
          to={{
            pathname: `${ConfigBase.providerBaseURL}/cadastro`,
          }}
          target="new_blank"
        >
          Para prestadores
          <BorderBottom />
        </NavbarText> */}

        <ButtonAreaClient
          to={ConfigRoutes.rebox.publics.signIn.path}
          style={{ height: 55, maxWidth: 230 }}
        >
          <IconUser />
          <ButtonAreaClientText>Área do cliente</ButtonAreaClientText>
        </ButtonAreaClient>
      </Navbar>
    </Container>
  );
};

export default MenuSidebarPublic;
