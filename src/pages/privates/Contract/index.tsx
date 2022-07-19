// ./src/pages/privates/Contract/index.tsx
import React, { useState, useCallback, useEffect } from 'react';

import { FiPlus } from 'react-icons/fi';
import { IoBagHandle, IoReload } from 'react-icons/io5';
import { useHistory } from 'react-router-dom';

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

const Contract: React.FC = () => {
  const { push } = useHistory();

  const [totalContracts, setTotalContracts] = useState<number>(0);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getContracts = useCallback(async () => {
    try {
      const { data: response } = await apiRebox.get(`/contracts?per_page=1`);
      const { header } = response;
      setTotalContracts(header.total);
    } catch (error) {
      console.error('Error ao tentar buscar total de contratos: ', error);
    } finally {
      setLoading(prevState => !prevState);
    }
  }, []);

  useEffect(() => {
    setLoading(prevState => !prevState);
    getContracts();
    // eslint-disable-next-line
  }, [refresh]);
  return (
    <Container>
      <HeaderNavigationPrivate />
      <ContainerGroup>
        <MenuSideBarPrivate />
        <Content>
          <SubtitleSecondary textAlign="start">Vendas</SubtitleSecondary>
          <ButtonsOption>
            <ButtonOutline
              className="btn-new"
              iconLeft={FiPlus}
              onClick={() =>
                push(ConfigRoutes.rebox.privates.sales.next.new.path)
              }
            >
              Nova
            </ButtonOutline>
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
              icon={IoBagHandle}
              iconColor={ConfigStyles.rebox.colors.greenEmerald.main}
              iconSize={28}
              iconOpacity={0.8}
              label={`Total de vendas`}
              value={formatText.numberSeparatedByThousand(totalContracts)}
              linkName={`Listar contratos`}
              route={ConfigRoutes.rebox.privates.sales.next.contracts.path}
            />
          </Estimates>
        </Content>
      </ContainerGroup>
    </Container>
  );
};

export default Contract;
