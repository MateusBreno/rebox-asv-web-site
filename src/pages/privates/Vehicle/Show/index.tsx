// ./src/pages/privates/Vehicles/Show/index.tsx
import React, { useCallback, useEffect, useState } from 'react';

import { IoArrowBack, IoChevronBack } from 'react-icons/io5';
import { useHistory, useParams } from 'react-router-dom';

import {
  HeaderNavigationPrivate,
  MenuSideBarPrivate,
  SubtitleSecondary,
  ButtonDefault,
  FormVehicleEdit,
  LoadingForm,
} from '@components/index';
import Vehicle from '@models/Vehicle';
import { apiRebox } from '@services/index';
import { toastify } from '@utils/notifiers';

import { IUrlParams } from './typing';

import {
  Container,
  ContainerGroup,
  Content,
  Options,
  OptionsGroup,
} from './styles';

const VehicleShow: React.FC = () => {
  const { goBack } = useHistory();
  const { id: vehicleId } = useParams<IUrlParams>();

  const [loading, setLoading] = useState<boolean>(false);
  const [vehicle, setVehicle] = useState<Vehicle>({} as Vehicle);

  const getVehicle = useCallback(async () => {
    try {
      setLoading(prevState => !prevState);
      const { data: responseVehicle } = await apiRebox.get(
        `/users/vehicles/${vehicleId}`,
      );
      setVehicle(responseVehicle.data);
    } catch (error) {
      toastify(
        'Ops! Houve um erro ao tentar buscar as os dados do veículo.',
        'error',
      );
    } finally {
      setLoading(prevState => !prevState);
    }
  }, []);

  const handleGoBack = () => {
    goBack();
  };

  useEffect(() => {
    getVehicle();
  }, []);

  return (
    <Container>
      <HeaderNavigationPrivate />
      <ContainerGroup>
        <MenuSideBarPrivate />
        <Content>
          <SubtitleSecondary textAlign="start">Veículo</SubtitleSecondary>
          <Options>
            <OptionsGroup>
              <ButtonDefault iconLeft={IoArrowBack} onClick={handleGoBack} />
            </OptionsGroup>
          </Options>
          {loading ? <LoadingForm /> : <FormVehicleEdit vehicle={vehicle} />}
        </Content>
      </ContainerGroup>
    </Container>
  );
};

export default VehicleShow;
