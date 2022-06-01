import React from 'react';

import { useTranslation } from 'react-i18next';

import { AssistanceSubtitle, AssistanceTitle, Container } from './styles';

const Assistance: React.FC = () => {
  const { t } = useTranslation(['Home2']);

  return (
    <Container>
      <AssistanceTitle>{t('Home2:assistance:title')}</AssistanceTitle>

      <AssistanceSubtitle>{t('Home2:assistance:subtitle')}</AssistanceSubtitle>
    </Container>
  );
};

export default Assistance;
