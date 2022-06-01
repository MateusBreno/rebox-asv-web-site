import React, { useCallback, useState } from 'react';

import ReactFacebookPixel from 'react-facebook-pixel';
import ReactGoogleAnalyticsPixel from 'react-ga';
import { IoArrowBack } from 'react-icons/io5';
import { useHistory } from 'react-router-dom';

import { ImageStenioGarcia } from '@assets/images';
import {
  HeaderNavigationPublic,
  MenuSideBarPublic,
  HeaderWizardNewSale,
  ButtonDefault,
  SubtitleMain,
  SubtitleSecondary,
  TitleSecondary,
  Paragraph,
  ButtonMain,
  ButtonOutline,
} from '@components/index';
import { ConfigRoutes, ConfigStyles, ConfigIntegrations } from '@config/index';
import { newContractStorageService } from '@services/index';

import {
  Container,
  Content,
  Options,
  OptionsGroup,
  Sections,
  SectionsImage,
  Buttons,
} from './styles';

const Thanks: React.FC = () => {
  /**
   * PIXEL DO FACEBOOK
   */
  ReactFacebookPixel.init(
    ConfigIntegrations.facebook.pixels.salesMonitoring.pixelId,
    ConfigIntegrations.facebook.pixels.salesMonitoring.advancedMatching,
    ConfigIntegrations.facebook.pixels.salesMonitoring.options,
  );
  ReactFacebookPixel.pageView();
  ReactFacebookPixel.track(
    ConfigIntegrations.facebook.pixels.salesMonitoring.track.event,
    ConfigIntegrations.facebook.pixels.salesMonitoring.track.value,
  );

  /**
   * PIXEL DO GOOGLE ANALYTICS
   */
  ReactGoogleAnalyticsPixel.initialize(
    ConfigIntegrations.googleAnalytics.pixels.salesMonitoring.gaTrackingID,
    ConfigIntegrations.googleAnalytics.pixels.salesMonitoring.options,
  );

  const { push } = useHistory();

  const [sidebarIsOpen, setSidebarIsOpen] = useState<boolean>(false);

  const handleOpenSidebar = useCallback(() => {
    setSidebarIsOpen(!sidebarIsOpen);
  }, [sidebarIsOpen]);

  const handleNewPurchase = useCallback(() => {
    newContractStorageService.cleanMany('all');
    push(ConfigRoutes.rebox.publics.plan.path);
  }, []);

  return (
    <Container sidebarIsOpen={sidebarIsOpen}>
      <MenuSideBarPublic
        handleOpenSidebar={handleOpenSidebar}
        sidebarIsOpen={sidebarIsOpen}
      />

      <HeaderNavigationPublic handleOpenSidebar={handleOpenSidebar} />

      <Content>
        <TitleSecondary textAlign="start">Checkout</TitleSecondary>
        <Options>
          <OptionsGroup>
            <ButtonDefault
              iconLeft={IoArrowBack}
              onClick={() => push(ConfigRoutes.rebox.publics.plan.path)}
              tabIndex={1}
            >
              Ver planos
            </ButtonDefault>
          </OptionsGroup>
        </Options>

        <Sections>
          <SectionsImage src={ImageStenioGarcia} />
          <SubtitleMain>Deu tudo certo!</SubtitleMain>
          <SubtitleSecondary nameColor="black" style={{ margin: '0.5vh 0' }}>
            Sua compra foi realizada com sucesso.
          </SubtitleSecondary>
          <Paragraph
            nameColor="black"
            fontSize={ConfigStyles.rebox.fonts.size.paragraph.big}
            fontWeight={500}
          >
            Geramos o contrato e todas as instruções foram enviadas para o
            e-mail cadastrado.
          </Paragraph>
          {/* <Paragraph
            nameColor="black"
            fontSize={ConfigStyles.rebox.fonts.size.paragraph.big}
            fontWeight={500}
          >
            Ah, lembrando que seu contrato será ativado assim que recebermos a
            confirmação do pagamento da 1ª cobrança. Só após o prazo de carência
            é iniciado.
          </Paragraph> */}
          <Buttons>
            <ButtonMain onClick={handleNewPurchase}>Nova compra</ButtonMain>
            {/* <ButtonOutline
          onClick={handleSellToTheSameCustomer}
          style={{ maxWidth: '300px' }}
        >
          Vender para mesmo cliente
        </ButtonOutline> */}
          </Buttons>
        </Sections>
      </Content>
    </Container>
  );
};

export default Thanks;
