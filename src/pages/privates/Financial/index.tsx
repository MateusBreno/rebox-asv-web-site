// ./src/pages/privates/Financial/index.tsx
import React, { useState, useCallback, useEffect } from 'react';

import { IoWarning, IoTrophy, IoRemoveCircle, IoReload } from 'react-icons/io5';

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

const Financial: React.FC = () => {
  const [totalChargesOverdue, setTotalChargesOverdue] = useState<number>(0);
  const [totalChargesGenerated, setTotalChargeGenerated] = useState<number>(0);
  const [totalChargesDeleted, setTotalChargesDeleted] = useState<number>(0);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getChargesGenerated = useCallback(async () => {
    try {
      let url = '/payments?per_page=1';
      url += `&what_is_being_paid=${ConfigValues.rebox.payments.what_is_being_paid.contracts}`;
      const { data: response } = await apiRebox.get(url);
      const { header } = response;
      setTotalChargeGenerated(header.total);
    } catch (error) {
      console.error(
        'Error ao tentar buscar total de cobranças atrasadas: ',
        error,
      );
    }
  }, []);

  const getChargesOverdue = useCallback(async () => {
    try {
      let url = '/payments?per_page=1';
      url += `&what_is_being_paid=${ConfigValues.rebox.payments.what_is_being_paid.contracts}`;
      url += `&status=${ConfigValues.rebox.payments.status.overdue}`;
      const { data: response } = await apiRebox.get(url);
      const { header } = response;
      setTotalChargesOverdue(header.total);
    } catch (error) {
      console.error(
        'Error ao tentar buscar total de cobranças atrasadas: ',
        error,
      );
    }
  }, []);

  const getChargesDeleted = useCallback(async () => {
    try {
      let url = '/payments?per_page=1';
      url += `&what_is_being_paid=${ConfigValues.rebox.payments.what_is_being_paid.contracts}`;
      url += `&status=${ConfigValues.rebox.payments.status.canceled}`;
      const { data: response } = await apiRebox.get(url);
      const { header } = response;
      setTotalChargesDeleted(header.total);
    } catch (error) {
      console.error(
        'Error ao tentar buscar total de cobranças deletadas: ',
        error,
      );
    } finally {
      setLoading(prevState => !prevState);
    }
  }, []);

  useEffect(() => {
    setLoading(prevState => !prevState);
    getChargesGenerated();
    getChargesOverdue();
    getChargesDeleted();
  }, [refresh]);

  return (
    <Container>
      <HeaderNavigationPrivate />
      <ContainerGroup>
        <MenuSideBarPrivate />
        <Content>
          <SubtitleSecondary textAlign="start">Financeiro</SubtitleSecondary>
          <ButtonsOption>
            <ButtonOutline
              className="btn-update"
              loading={loading}
              iconLeft={IoReload}
              onClick={() => setRefresh(prevState => !prevState)}
              style={{ minWidth: '140px' }}
            >
              Atualizar
            </ButtonOutline>
          </ButtonsOption>
          <Estimates>
            <CardSimpleEstimate
              icon={IoTrophy}
              iconColor={ConfigStyles.rebox.colors.greenSea.main}
              iconSize={28}
              iconOpacity={0.8}
              label={`Cobranças geradas`}
              value={formatText.numberSeparatedByThousand(
                totalChargesGenerated,
              )}
              linkName={`Listar cobranças`}
              route={ConfigRoutes.rebox.privates.financial.next.charges.path}
            />
            <CardSimpleEstimate
              icon={IoWarning}
              iconColor={ConfigStyles.rebox.colors.yellowRisenShine.main}
              iconSize={28}
              iconOpacity={0.8}
              label={`Cobranças em atraso`}
              value={formatText.numberSeparatedByThousand(totalChargesOverdue)}
              linkName={`Listar cobranças`}
              route={ConfigRoutes.rebox.privates.financial.next.charges.path}
            />
            <CardSimpleEstimate
              icon={IoRemoveCircle}
              iconColor={ConfigStyles.rebox.colors.gray.main}
              iconSize={28}
              iconOpacity={0.8}
              label={`Cobranças canceladas`}
              value={formatText.numberSeparatedByThousand(totalChargesDeleted)}
              linkName={`Listar cobranças`}
              route={ConfigRoutes.rebox.privates.financial.next.charges.path}
            />
          </Estimates>
        </Content>
      </ContainerGroup>
    </Container>
  );
};

export default Financial;
