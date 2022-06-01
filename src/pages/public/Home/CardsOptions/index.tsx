import React from 'react';

import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';

import {
  IconBattery,
  IconCrashedCar,
  IconFlatTire,
  IconFuelBomb,
  IconKey,
  IconWinchTruck,
} from '@assets/icons';
import { toastify } from '@utils/notifiers';

import { Card, CardText, Container } from './styles';

const CardsOptions: React.FC = () => {
  const { t } = useTranslation(['Home2']);

  const alert = () => {
    toastify(
      'Para solicitar nossos serviços, por favor ligue para 0800 100 1100.',
      'info',
    );
  };

  return (
    <Container>
      <Card onClick={alert} className="winch">
        <IconWinchTruck />
        <CardText>Guincho</CardText>
      </Card>

      <Card onClick={alert} className="tire-change">
        <IconFlatTire />
        <CardText>Troca de pneu</CardText>
      </Card>

      <Card onClick={alert} className="battery-recharge">
        <IconBattery />
        <CardText>Recarga de bateria</CardText>
      </Card>

      <Card onClick={alert} className="locksmith">
        <IconKey />
        <CardText>Chaveiro</CardText>
      </Card>

      <Card onClick={alert} className="fuel">
        <IconFuelBomb />
        <CardText>Combustível</CardText>
      </Card>

      <Card onClick={alert} className="mechanical-relief">
        <IconCrashedCar />
        <CardText>Socorro mecânico</CardText>
      </Card>
      <ToastContainer />
    </Container>
  );
};

export default CardsOptions;
