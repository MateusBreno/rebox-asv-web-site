// ./src/pages/privates/Products/index.tsx
import React, { useState, useCallback, useEffect } from 'react';

import { FaHandHoldingUsd } from 'react-icons/fa';
import { IoReload } from 'react-icons/io5';

import {
  CardSimpleEstimate,
  HeaderNavigationPrivate,
  MenuSideBarPrivate,
  SubtitleSecondary,
  ButtonOutline,
} from '@components/index';
import { ConfigStyles, ConfigRoutes } from '@config/index';
import { apiRebox } from '@services/index';
import { formatText } from '@utils/formatters';

import {
  Container,
  ContainerGroup,
  Content,
  Estimates,
  ButtonsOption,
} from './styles';

const Rescue: React.FC = () => {
  const [totalRescues, setTotalRescues] = useState<number>(0);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getRescues = useCallback(async () => {
    try {
      const { data: response } = await apiRebox.get(`/rescues?per_page=1`);
      const { header } = response;
      setTotalRescues(header.total);
    } catch (error) {
      console.error('Error ao tentar buscar total de resgates: ', error);
    } finally {
      setLoading(prevState => !prevState);
    }
  }, []);

  useEffect(() => {
    setLoading(prevState => !prevState);
    getRescues();
    // eslint-disable-next-line
  }, [refresh]);
  return (
    <Container>
      <HeaderNavigationPrivate />
      <ContainerGroup>
        <MenuSideBarPrivate />
        <Content>
          <SubtitleSecondary textAlign="start">Resgates</SubtitleSecondary>
          <ButtonsOption>
            <ButtonOutline
              className="btn-update"
              loading={loading}
              iconLeft={IoReload}
              style={{ minWidth: '140px' }}
              onClick={() => setRefresh(prevState => !prevState)}
            >
              Atualizar
            </ButtonOutline>
          </ButtonsOption>
          <Estimates>
            <CardSimpleEstimate
              icon={FaHandHoldingUsd}
              iconColor={ConfigStyles.rebox.colors.purple.main}
              iconSize={28}
              iconOpacity={0.8}
              label={`Total de comissões`}
              value={formatText.numberSeparatedByThousand(totalRescues)}
              linkName={`Listar comissões`}
              route={ConfigRoutes.rebox.privates.rescues.next.commissions.path}
            />
          </Estimates>
        </Content>
      </ContainerGroup>
    </Container>
  );
};

export default Rescue;
