import React from 'react';

import { useTranslation } from 'react-i18next';
import { EmailShareButton } from 'react-share';

import { IconChat } from '@assets/icons';
import { IconBackgroundWinchTruck } from '@assets/images';

import {
  Background,
  ContactUs,
  ContactUsText,
  Container,
  Content,
  TextTerms,
} from './styles';

const Footer: React.FC = () => {
  const { t } = useTranslation(['Home2']);

  return (
    <Container>
      <Background src={IconBackgroundWinchTruck} />

      <Content>
        <TextTerms to="/">{t('Home2:footer:terms')}</TextTerms>

        <EmailShareButton
          subject={'Preciso de ajuda para solicitar a assistência!'}
          body={
            'Olá Rebox! Estou com dúvidas sobre como solicitar a assistência veicular 24h, podem me ajudar?'
          }
          url={'contato@rebox.com.br'}
        >
          <ContactUs>
            <IconChat />
            <ContactUsText>{t('Home2:footer:contact_us')}</ContactUsText>
          </ContactUs>
        </EmailShareButton>
      </Content>
    </Container>
  );
};

export default Footer;
