import React from 'react';

import { useTranslation } from 'react-i18next';

import { IconMobileApp, IconTelephone } from '@assets/icons';

import { Container, Content, Info, TextBlue, TextGray } from './styles';

const Contacts: React.FC = () => {
  const { t } = useTranslation(['Home2']);

  return (
    <Container>
      <Content>
        <IconTelephone />

        <Info>
          <TextGray>{t('Home2:contacts:or_call')}</TextGray>
          <TextBlue>{t('Home2:contacts:number_telephone')}</TextBlue>
        </Info>
      </Content>

      {/* <Content>
        <IconMobileApp />

        <Info>
          <TextGray>{t('Home2:contacts:app_android_ios')}</TextGray>
          <TextBlue>{t('Home2:contacts:download_now')}</TextBlue>
        </Info>
      </Content> */}
    </Container>
  );
};

export default Contacts;
