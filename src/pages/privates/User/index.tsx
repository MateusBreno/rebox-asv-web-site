// ./src/pages/privates/User/index.tsx
import React, { useState, useCallback, useEffect } from 'react';

import { IoRocket, IoDiamond, IoConstruct, IoReload } from 'react-icons/io5';

import {
  CardSimpleEstimate,
  HeaderNavigationPrivate,
  MenuSideBarPrivate,
  SubtitleSecondary,
  ButtonOutline,
} from '@components/index';
import { ConfigRoutes, ConfigStyles, ConfigValues } from '@config/index';
import { apiRebox } from '@services/index';
import { formatText } from '@utils/formatters';

import {
  Container,
  ContainerGroup,
  Content,
  Estimates,
  ButtonsOption,
} from './styles';

const User: React.FC = () => {
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [totalAffiliates, setTotalAffiliates] = useState<number>(0);
  const [totalProviders, setTotalProviders] = useState<number>(0);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getCustomers = useCallback(async () => {
    try {
      const { data: response } = await apiRebox.get(
        `/users?per_page=1&role=${ConfigValues.rebox.user.role.client}`,
      );
      const { header } = response;
      setTotalCustomers(header.total);
    } catch (error) {
      //  eslint-disable-next-line no-console
      console.error('Error ao tentar buscar total de clientes: ', error);
    }
  }, []);

  const getAffiliates = useCallback(async () => {
    try {
      const { data: response } = await apiRebox.get(
        `/users?per_page=1&role=${ConfigValues.rebox.user.role.partner}`,
      );
      const { header } = response;
      setTotalAffiliates(header.total);
    } catch (error) {
      //  eslint-disable-next-line no-console
      console.error('Error ao tentar buscar total de clientes: ', error);
    }
  }, []);

  const getProviders = useCallback(async () => {
    try {
      const { data: response } = await apiRebox.get(
        `/users?per_page=1&role=${ConfigValues.rebox.user.role.provider}`,
      );
      const { header } = response;
      setTotalProviders(header.total);
    } catch (error) {
      //  eslint-disable-next-line no-console
      console.error('Error ao tentar buscar total de clientes: ', error);
    } finally {
      setLoading(prevState => !prevState);
    }
  }, []);

  useEffect(() => {
    setLoading(prevState => !prevState);
    getCustomers();
    getAffiliates();
    getProviders();
    // eslint-disable-next-line
  }, [refresh]);

  return (
    <Container>
      <HeaderNavigationPrivate />
      <ContainerGroup>
        <MenuSideBarPrivate />
        <Content>
          <SubtitleSecondary textAlign="start">Usuários</SubtitleSecondary>
          <ButtonsOption>
            <ButtonOutline
              className="btn-update"
              loading={loading}
              iconLeft={IoReload}
              onClick={() => setRefresh(prevState => !prevState)}
            >
              Atualizar
            </ButtonOutline>
          </ButtonsOption>
          <Estimates>
            <CardSimpleEstimate
              icon={IoRocket}
              iconColor={ConfigStyles.rebox.colors.purple.main}
              iconSize={28}
              iconOpacity={0.8}
              label={`Total de clientes`}
              value={formatText.numberSeparatedByThousand(totalCustomers)}
              linkName={`Listar clientes`}
              route={ConfigRoutes.rebox.privates.users.next.customers.path}
            />
            <CardSimpleEstimate
              icon={IoDiamond}
              iconColor={ConfigStyles.rebox.colors.greenSea.main}
              iconSize={28}
              iconOpacity={0.8}
              label={`Total de afiliados`}
              value={formatText.numberSeparatedByThousand(totalAffiliates)}
              linkName={`Listar afiliados`}
              route={ConfigRoutes.rebox.privates.users.next.affiliates.path}
            />
            <CardSimpleEstimate
              icon={IoConstruct}
              iconColor={ConfigStyles.rebox.colors.orange.main}
              iconSize={28}
              iconOpacity={0.8}
              label={`Total de prestadores`}
              value={formatText.numberSeparatedByThousand(totalProviders)}
              linkName={`Listar prestadores`}
              route={ConfigRoutes.rebox.privates.users.next.providers.path}
            />
          </Estimates>
        </Content>
      </ContainerGroup>
    </Container>
  );
};

export default User;
