import React, { useCallback, useState } from 'react';

import { HeaderNavigationPublic, MenuSideBarPublic } from '@components/index';

import Assistance from './Assistance';
import CardsOptions from './CardsOptions';
import Contacts from './Contacts';
import Footer from './Footer';

import { Container } from './styles';

const Home: React.FC = () => {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  const handleOpenSidebar = useCallback(() => {
    setSidebarIsOpen(!sidebarIsOpen);
  }, [sidebarIsOpen]);

  return (
    <Container sidebarIsOpen={sidebarIsOpen}>
      <div>
        <MenuSideBarPublic
          handleOpenSidebar={handleOpenSidebar}
          sidebarIsOpen={sidebarIsOpen}
        />

        <HeaderNavigationPublic handleOpenSidebar={handleOpenSidebar} />
        <Assistance />
        <CardsOptions />
        <Contacts />
        <Footer />
      </div>
    </Container>
  );
};

export default Home;
