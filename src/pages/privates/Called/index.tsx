// ./src/pages/privates/Called/index.tsx
import React, { useState, useCallback, useEffect } from 'react';

import { FaRoute } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import { IoReload } from 'react-icons/io5';
import { useHistory } from 'react-router-dom';

import {
  CardSimpleEstimate,
  HeaderNavigationPrivate,
  MenuSideBarPrivate,
  SubtitleSecondary,
  ButtonOutline,
} from '@components/index';
import { ConfigRoutes, ConfigStyles } from '@config/index';
import { apiRebox } from '@services/index';
import { formatText } from '@utils/formatters';

import {
  Container,
  ContainerGroup,
  Content,
  Estimates,
  ButtonsOption,
} from './styles';

const Called: React.FC = () => {
  const { push } = useHistory();
  const [totalCalled, setTotalCalled] = useState<number>(0);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getCalled = useCallback(async () => {
    try {
      const { data: response } = await apiRebox.get(`/called?per_page=1`);
      const { header } = response;
      setTotalCalled(header.total);
    } catch (error) {
      console.error('Error ao tentar buscar total de contratos: ', error);
    } finally {
      setLoading(prevState => !prevState);
    }
  }, []);

  useEffect(() => {
    setLoading(prevState => !prevState);
    getCalled();
  }, [refresh]);
  return (
    <Container>
      <HeaderNavigationPrivate />
      <ContainerGroup>
        <MenuSideBarPrivate />
        <Content>
          <SubtitleSecondary textAlign="start">Chamados</SubtitleSecondary>
          <ButtonsOption>
            <ButtonOutline
              className="btn-new"
              iconLeft={FiPlus}
              onClick={() =>
                push(ConfigRoutes.rebox.privates.called.next.new.path)
              }
            >
              Novo
            </ButtonOutline>
            <ButtonOutline
              className="btn-update"
              loading={loading}
              iconLeft={IoReload}
              onClick={() => setRefresh(prevState => !prevState)}
              style={{ width: '140px' }}
            >
              Atualizar
            </ButtonOutline>
          </ButtonsOption>
          <Estimates>
            {/* <CardSimpleEstimate
              icon={FaRoute}
              iconColor={ConfigStyles.rebox.colors.greenEmerald.main}
              iconSize={28}
              iconOpacity={0.8}
              label={`Total de acionamentos`}
              value={formatText.numberSeparatedByThousand(totalCalled)}
              linkName={`Listar acionamentos`}
              // route={ConfigRoutes.rebox.privates.called.next.drives.path}
            /> */}
          </Estimates>
        </Content>
      </ContainerGroup>
    </Container>
  );
};

export default Called;
